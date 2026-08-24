import { prisma } from "../db";

// Intent patterns mapped to service categories
const INTENT_PATTERNS: Record<string, {
  keywords: string[];
  category: string;
  services: string[];
  description: string;
}> = {
  restaurant_business_setup: {
    keywords: ["restaurant", "food", "cafe", "dining", "eatery", "food stall", "canteen", "hotel food"],
    category: "food",
    services: [
      "business_registration",
      "tax_registration",
      "food_license",
      "municipal_permission",
      "fire_safety",
      "final_approval",
    ],
    description: "Restaurant Business Setup",
  },
  business_registration: {
    keywords: ["business", "company", "startup", "enterprise", "firm", "shop", "store", "trade"],
    category: "business",
    services: [
      "business_registration",
      "tax_registration",
      "municipal_permission",
      "final_approval",
    ],
    description: "Business Registration",
  },
  license_application: {
    keywords: ["license", "permit", "authorization", "certification"],
    category: "general",
    services: [
      "business_registration",
      "municipal_permission",
      "final_approval",
    ],
    description: "License Application",
  },
  property_registration: {
    keywords: ["property", "land", "real estate", "house", "flat", "apartment", "building"],
    category: "municipal",
    services: [
      "municipal_permission",
      "tax_registration",
      "final_approval",
    ],
    description: "Property Registration",
  },
  scheme_application: {
    keywords: ["scheme", "subsidy", "welfare", "government scheme", "benefit", "yojana"],
    category: "general",
    services: [
      "tax_registration",
      "municipal_permission",
      "final_approval",
    ],
    description: "Government Scheme Application",
  },
  manufacturing_setup: {
    keywords: ["manufacturing", "factory", "production", "industry", "plant"],
    category: "business",
    services: [
      "business_registration",
      "tax_registration",
      "municipal_permission",
      "fire_safety",
      "final_approval",
    ],
    description: "Manufacturing Setup",
  },
};

export interface ParsedIntent {
  intent: string;
  intentKey: string;
  location: string;
  category: string;
  description: string;
  serviceCodes: string[];
  confidence: number;
}

export function parseIntent(userInput: string): ParsedIntent {
  const input = userInput.toLowerCase().trim();

  // Extract location - common Indian cities
  const cities = [
    "pune", "mumbai", "nagpur", "nashik", "aurangabad", "nagpur",
    "ahmedabad", "delhi", "bangalore", "chennai", "hyderabad", "kolkata",
    "jaipur", "lucknow", "bhopal", "patna", "indore", "thane", "noida",
    "gurgaon", "surat", "rajkot", "vadodara",
  ];

  let location = "Pune"; // default
  for (const city of cities) {
    if (input.includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Match against intent patterns
  let bestMatch = {
    key: "business_registration",
    score: 0,
  };

  for (const [key, pattern] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (input.includes(keyword)) {
        score += keyword.length; // longer keywords = more specific
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { key, score };
    }
  }

  const matchedPattern = INTENT_PATTERNS[bestMatch.key];

  return {
    intent: matchedPattern.description,
    intentKey: bestMatch.key,
    location,
    category: matchedPattern.category,
    description: matchedPattern.description,
    serviceCodes: matchedPattern.services,
    confidence: Math.min(0.95, 0.6 + bestMatch.score * 0.05),
  };
}

export async function resolveServices(serviceCodes: string[]) {
  const services = await prisma.service.findMany({
    where: {
      code: { in: serviceCodes },
      status: "active",
    },
    include: {
      department: true,
    },
    orderBy: { name: "asc" },
  });

  return services;
}

export async function getServiceDependencies(serviceId: string) {
  // For now, return hardcoded dependency chains
  // In production, this would query ServiceDependency table
  const dependencyChains: Record<string, string[]> = {
    business_registration: [],
    tax_registration: ["business_registration"],
    food_license: ["business_registration", "tax_registration"],
    municipal_permission: ["business_registration"],
    fire_safety: ["business_registration", "municipal_permission"],
    final_approval: [
      "business_registration",
      "tax_registration",
      "municipal_permission",
    ],
  };

  return dependencyChains[serviceId] || [];
}

export async function analyzeRequest(userInput: string) {
  // 1. Parse intent
  const intent = parseIntent(userInput);

  // 2. Resolve services from registry
  const services = await resolveServices(intent.serviceCodes);

  // 3. Build dependency-aware workflow
  const workflow: Array<{
    serviceId: string;
    code: string;
    name: string;
    department: string;
    departmentId: string;
    description: string;
    estimatedDays: number;
    requiredDocuments: string[];
    requiredFields: string[];
    dependencies: string[];
  }> = [];
  const resolved = new Set<string>();

  // Topological sort based on dependencies
  function resolveDependencies(serviceCode: string) {
    if (resolved.has(serviceCode)) return;
    const deps = dependencyChains[serviceCode] || [];
    for (const dep of deps) {
      resolveDependencies(dep);
    }
    const service = services.find((s) => s.code === serviceCode);
    if (service) {
      resolved.add(serviceCode);
      workflow.push({
        serviceId: service.id,
        code: service.code,
        name: service.name,
        department: service.department.name,
        departmentId: service.department.id,
        description: service.description,
        estimatedDays: service.estimatedDays,
        requiredDocuments: JSON.parse(service.requiredDocuments || "[]"),
        requiredFields: JSON.parse(service.requiredFields || "[]"),
        dependencies: deps,
      });
    }
  }

  const dependencyChains: Record<string, string[]> = {
    business_registration: [],
    tax_registration: ["business_registration"],
    food_license: ["business_registration", "tax_registration"],
    municipal_permission: ["business_registration"],
    fire_safety: ["business_registration", "municipal_permission"],
    final_approval: [
      "business_registration",
      "tax_registration",
      "municipal_permission",
    ],
  };

  for (const code of intent.serviceCodes) {
    resolveDependencies(code);
  }

  return {
    intent,
    services: workflow,
    totalSteps: workflow.length,
    estimatedTotalDays: workflow.reduce((acc, s) => acc + s.estimatedDays, 0),
  };
}
