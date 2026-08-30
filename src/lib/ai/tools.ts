// ─── OneGov AI Engine — Tool Definitions ───────────────────────
// Controlled backend functions the AI can invoke

import type {
  ToolDefinition,
  ToolCall,
  ToolResult,
  ConversationContext,
  ServiceDocument,
} from "./types";
import { getRAGRetriever } from "./rag";
import { MOCK_SERVICES, MOCK_JOURNEYS } from "@/lib/mock-data";

// ─── Tool Registry ─────────────────────────────────────────────

export const AI_TOOLS: ToolDefinition[] = [
  {
    name: "search_services",
    description:
      "Search the government service registry for services matching a user's goal. Returns relevant services with their details.",
    parameters: {
      query: {
        type: "string",
        description: "Natural language query about the service needed",
        required: true,
      },
      category: {
        type: "string",
        description: "Optional category filter (business, food, identity, tax, transport, civil, property, safety, municipal)",
        required: false,
      },
    },
  },
  {
    name: "get_service_details",
    description:
      "Get detailed information about a specific government service including requirements, documents, and prerequisites.",
    parameters: {
      serviceCode: {
        type: "string",
        description: "The service code (e.g., business_registration, food_license)",
        required: true,
      },
    },
  },
  {
    name: "get_service_prerequisites",
    description:
      "Check what prerequisites are needed before applying for a service. Returns dependency chain.",
    parameters: {
      serviceCode: {
        type: "string",
        description: "The service code to check prerequisites for",
        required: true,
      },
    },
  },
  {
    name: "check_user_profile",
    description:
      "Check what information the user has already provided in their OneGov profile. Used to avoid asking for重复 information.",
    parameters: {
      userId: {
        type: "string",
        description: "The user's ID",
        required: true,
      },
    },
  },
  {
    name: "get_user_journeys",
    description:
      "Get the user's existing service journeys to understand their current status and avoid duplicate work.",
    parameters: {
      userId: {
        type: "string",
        description: "The user's ID",
        required: true,
      },
    },
  },
  {
    name: "generate_workflow",
    description:
      "Generate a complete service workflow/roadmap for a confirmed goal. Returns ordered steps with dependencies.",
    parameters: {
      serviceCodes: {
        type: "string",
        description: "Comma-separated list of service codes for the workflow",
        required: true,
      },
      title: {
        type: "string",
        description: "Title for the workflow (e.g., 'Restaurant Setup')",
        required: true,
      },
      location: {
        type: "string",
        description: "City and state for location-specific requirements",
        required: false,
      },
    },
  },
  {
    name: "get_cities_in_state",
    description:
      "Get available cities in an Indian state for location-specific service routing.",
    parameters: {
      state: {
        type: "string",
        description: "Indian state name",
        required: true,
      },
    },
  },
];

// ─── Tool Handlers ─────────────────────────────────────────────

const INDIAN_STATES_AND_CITIES: Record<string, string[]> = {
  maharashtra: ["pune", "mumbai", "nagpur", "nashik", "aurangabad", "thane", "navi mumbai"],
  karnataka: ["bangalore", "mysore", "hubli", "mangalore"],
  "tamil nadu": ["chennai", "coimbatore", "madurai", "salem"],
  delhi: ["new delhi", "dwarka", "rohini"],
  gujarat: ["ahmedabad", "surat", "vadodara", "rajkot"],
  rajasthan: ["jaipur", "jodhpur", "udaipur", "kota"],
  "uttar pradesh": ["lucknow", "noida", "gurgaon", "varanasi", "agra"],
  "west bengal": ["kolkata", "howrah", "darjeeling"],
  "andhra pradesh": ["visakhapatnam", "vijayawada", "guntur"],
  telangana: ["hyderabad", "warangal", "nizamabad"],
  kerala: ["thiruvananthapuram", "kochi", "kozhikode"],
  punjab: ["chandigarh", "ludhiana", "amritsar"],
  haryana: ["gurgaon", "faridabad", "panipat"],
  bihar: ["patna", "gaya", "bhagalpur"],
  odisha: ["bhubaneswar", "cuttack", "rourkela"],
  jharkhand: ["ranchi", "jamshedpur", "dhanbad"],
  chhattisgarh: ["raipur", "bilaspur"],
  assam: ["guwahati", "silchar"],
  goa: ["panaji", "vasco da gama", "madgaon"],
  "himachal pradesh": ["shimla", "manali", "dharamshala"],
  uttarakhand: ["dehradun", "haridwar", "nainital"],
};

export async function executeToolCall(
  toolCall: ToolCall,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    switch (toolCall.name) {
      case "search_services":
        return handleSearchServices(toolCall.arguments);

      case "get_service_details":
        return handleGetServiceDetails(toolCall.arguments);

      case "get_service_prerequisites":
        return handleGetServicePrerequisites(toolCall.arguments);

      case "check_user_profile":
        return handleCheckUserProfile(toolCall.arguments);

      case "get_user_journeys":
        return handleGetUserJourneys(toolCall.arguments);

      case "generate_workflow":
        return handleGenerateWorkflow(toolCall.arguments);

      case "get_cities_in_state":
        return handleGetCitiesInState(toolCall.arguments);

      default:
        return {
          toolName: toolCall.name,
          success: false,
          data: null,
          error: `Unknown tool: ${toolCall.name}`,
        };
    }
  } catch (error) {
    return {
      toolName: toolCall.name,
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Tool execution failed",
    };
  }
}

// ─── Individual Tool Handlers ──────────────────────────────────

function handleSearchServices(
  args: Record<string, unknown>
): ToolResult {
  const query = String(args.query || "");
  const category = args.category ? String(args.category) : undefined;

  const retriever = getRAGRetriever();
  let results = retriever.retrieve(query, 10);

  if (category) {
    results = results.filter((r) => r.document.category === category);
  }

  return {
    toolName: "search_services",
    success: true,
    data: {
      count: results.length,
      services: results.map((r) => ({
        serviceCode: r.document.serviceCode,
        name: r.document.name,
        department: r.document.department,
        description: r.document.description,
        category: r.document.category,
        relevanceScore: Math.round(r.score * 100) / 100,
        estimatedDays: r.document.estimatedDays,
        requiredDocuments: r.document.requiredDocuments.length,
        requiredFields: r.document.requiredFields.length,
      })),
    },
  };
}

function handleGetServiceDetails(
  args: Record<string, unknown>
): ToolResult {
  const serviceCode = String(args.serviceCode || "");
  const retriever = getRAGRetriever();
  const doc = retriever.getService(serviceCode);

  if (!doc) {
    return {
      toolName: "get_service_details",
      success: false,
      data: null,
      error: `Service not found: ${serviceCode}`,
    };
  }

  // Also find the matching mock service for additional data
  const mockService = MOCK_SERVICES.find((s) => s.code === serviceCode);

  return {
    toolName: "get_service_details",
    success: true,
    data: {
      serviceCode: doc.serviceCode,
      name: doc.name,
      department: doc.department,
      description: doc.description,
      category: doc.category,
      requiredDocuments: doc.requiredDocuments,
      requiredFields: doc.requiredFields,
      eligibility: doc.eligibility,
      prerequisites: doc.prerequisites,
      estimatedDays: doc.estimatedDays,
      slaDays: mockService?.slaDays || doc.estimatedDays * 2,
      officialPortal: doc.officialPortal,
    },
  };
}

function handleGetServicePrerequisites(
  args: Record<string, unknown>
): ToolResult {
  const serviceCode = String(args.serviceCode || "");
  const retriever = getRAGRetriever();
  const doc = retriever.getService(serviceCode);

  if (!doc) {
    return {
      toolName: "get_service_prerequisites",
      success: false,
      data: null,
      error: `Service not found: ${serviceCode}`,
    };
  }

  // Find dependencies from mock data
  const mockService = MOCK_SERVICES.find((s) => s.code === serviceCode);
  const dependencyServices = MOCK_SERVICES.filter(
    (s) => s.code !== serviceCode
  ).filter((s) => {
    // Check if this service's required documents mention other service codes
    return s.requiredDocuments.some(
      (d) =>
        d.includes(serviceCode) ||
        serviceCode.includes(d.replace("_cert", "").replace("_proof", ""))
    );
  });

  return {
    toolName: "get_service_prerequisites",
    success: true,
    data: {
      serviceCode,
      serviceName: doc.name,
      prerequisites: doc.prerequisites,
      requiredDocuments: doc.requiredDocuments,
      requiredBeforeThis: dependencyServices.map((s) => ({
        serviceCode: s.code,
        name: s.name,
        reason: `Required for ${doc.name}`,
      })),
    },
  };
}

function handleCheckUserProfile(
  args: Record<string, unknown>
): ToolResult {
  const userId = String(args.userId || "");

  // In a real system, this would query the database
  // For the prototype, we use mock data
  const userEntry = Object.values(
    require("@/lib/mock-data").MOCK_USERS
  ).find((u: any) => u.id === userId) as any;

  if (!userEntry) {
    return {
      toolName: "check_user_profile",
      success: true,
      data: {
        hasProfile: false,
        availableFields: [],
      },
    };
  }

  const profile = userEntry.profile || {};

  return {
    toolName: "check_user_profile",
    success: true,
    data: {
      hasProfile: true,
      name: userEntry.name,
      email: userEntry.email,
      availableFields: Object.keys(profile).filter(
        (k) => profile[k] !== null && profile[k] !== undefined
      ),
      fieldValues: profile,
    },
  };
}

function handleGetUserJourneys(
  args: Record<string, unknown>
): ToolResult {
  const userId = String(args.userId || "");

  const userJourneys = MOCK_JOURNEYS.filter((j) => j.userId === userId);

  return {
    toolName: "get_user_journeys",
    success: true,
    data: {
      count: userJourneys.length,
      journeys: userJourneys.map((j) => ({
        id: j.id,
        intent: j.intent,
        status: j.status,
        progress: j.progress,
        stepCount: j.steps?.length || 0,
        createdAt: j.createdAt,
      })),
    },
  };
}

function handleGenerateWorkflow(
  args: Record<string, unknown>
): ToolResult {
  const serviceCodesStr = String(args.serviceCodes || "");
  const title = String(args.title || "Service Journey");
  const location = args.location ? String(args.location) : "India";

  const serviceCodes = serviceCodesStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const steps = serviceCodes
    .map((code, index) => {
      const mockService = MOCK_SERVICES.find((s) => s.code === code);
      const kbDoc = getRAGRetriever().getService(code);

      if (!mockService && !kbDoc) return null;

      return {
        id: `step-gen-${Date.now()}-${index + 1}`,
        sequence: index + 1,
        title: kbDoc?.name || mockService?.name || code,
        serviceCode: code,
        department: kbDoc?.department || mockService?.department?.name || "Government Department",
        description: kbDoc?.description || mockService?.description || "",
        status: "pending" as const,
        dependencies: index > 0 ? [`step-gen-${Date.now()}-${index}`] : [],
        requiredDocuments: kbDoc?.requiredDocuments || mockService?.requiredDocuments || [],
        requiredFields: kbDoc?.requiredFields || mockService?.requiredFields || [],
        estimatedDays: kbDoc?.estimatedDays || mockService?.estimatedDays || 7,
      };
    })
    .filter(Boolean);

  return {
    toolName: "generate_workflow",
    success: true,
    data: {
      title,
      location,
      totalSteps: steps.length,
      estimatedDays: steps.reduce((sum, s) => sum + (s?.estimatedDays || 0), 0),
      steps,
    },
  };
}

function handleGetCitiesInState(
  args: Record<string, unknown>
): ToolResult {
  const state = String(args.state || "").toLowerCase();
  const cities = INDIAN_STATES_AND_CITIES[state] || [];

  return {
    toolName: "get_cities_in_state",
    success: true,
    data: {
      state: args.state,
      cities,
      count: cities.length,
    },
  };
}
