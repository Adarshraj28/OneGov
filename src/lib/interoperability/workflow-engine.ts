// ─── Configurable Workflow Engine ──────────────────────────────
// Supports dynamic workflow configuration and orchestration

export interface WorkflowStep {
  id: string;
  serviceCode: string;
  name: string;
  department: string;
  dependencies: string[];
  requiredFields: string[];
  optionalFields: string[];
  estimatedDays: number;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  status: "pending" | "waiting" | "in_progress" | "submitted" | "approved" | "rejected" | "failed" | "completed";
  sequence: number;
  startedAt?: string;
  completedAt?: string;
  externalApplicationId?: string;
  retryCount: number;
  error?: string;
}

export interface Workflow {
  id: string;
  userId: string;
  intent: string;
  intentParsed?: ParsedIntent;
  steps: WorkflowStep[];
  status: "created" | "in_progress" | "completed" | "failed" | "cancelled";
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedIntent {
  intent: string;
  intentKey: string;
  location: string;
  category: string;
  description: string;
  serviceCodes: string[];
  confidence: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Omit<WorkflowStep, "status" | "retryCount" | "sequence">[];
}

// ─── Intent Parser ─────────────────────────────────────────────

const INTENT_PATTERNS: Record<
  string,
  {
    keywords: string[];
    category: string;
    services: string[];
    description: string;
  }
> = {
  restaurant_business_setup: {
    keywords: ["restaurant", "food", "cafe", "dining", "eatery", "food stall"],
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
  general_business_setup: {
    keywords: ["business", "company", "startup", "enterprise", "firm", "shop"],
    category: "business",
    services: [
      "business_registration",
      "tax_registration",
      "municipal_permission",
      "final_approval",
    ],
    description: "Business Registration",
  },
  identity_documents: {
    keywords: ["aadhaar", "pan card", "passport", "voter id", "driving license"],
    category: "identity",
    services: ["aadhaar_update", "pan_card", "passport", "voter_id", "driving_license"],
    description: "Identity Document Applications",
  },
  property: {
    keywords: ["property", "land", "real estate", "house", "flat", "register"],
    category: "property",
    services: [
      "property_registration",
      "municipal_permission",
      "final_approval",
    ],
    description: "Property Registration",
  },
  civil_documents: {
    keywords: ["birth certificate", "death certificate", "marriage", "income certificate", "caste certificate"],
    category: "civil",
    services: ["birth_certificate", "death_certificate", "marriage_registration", "income_certificate", "caste_certificate"],
    description: "Civil Documents",
  },
};

const INDIAN_CITIES = [
  "pune", "mumbai", "nagpur", "nashik", "aurangabad", "ahmedabad",
  "delhi", "bangalore", "chennai", "hyderabad", "kolkata", "jaipur",
  "lucknow", "bhopal", "patna", "indore", "thane", "noida",
  "gurgaon", "surat", "rajkot", "vadodara",
];

export function parseIntent(userInput: string): ParsedIntent {
  const input = userInput.toLowerCase().trim();

  // Extract location
  let location = "Pune"; // default
  for (const city of INDIAN_CITIES) {
    if (input.includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Match against intent patterns
  let bestMatch = { key: "general_business_setup", score: 0 };

  for (const [key, pattern] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (input.includes(keyword)) {
        score += keyword.length;
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

// ─── Workflow Templates ────────────────────────────────────────

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "template-restaurant",
    name: "Restaurant Setup",
    description: "Complete workflow for setting up a restaurant",
    category: "food",
    steps: [
      {
        id: "step-1",
        serviceCode: "business_registration",
        name: "Business Registration",
        department: "Ministry of Corporate Affairs",
        dependencies: [],
        requiredFields: ["name", "email", "phone", "address", "businessName", "businessType"],
        optionalFields: ["website", "logo"],
        estimatedDays: 7,
        retryPolicy: { maxRetries: 3, backoffMs: 2000 },
      },
      {
        id: "step-2",
        serviceCode: "tax_registration",
        name: "GST Registration",
        department: "Income Tax Department",
        dependencies: ["step-1"],
        requiredFields: ["panNumber", "businessName", "address"],
        optionalFields: ["annualTurnover"],
        estimatedDays: 5,
        retryPolicy: { maxRetries: 2, backoffMs: 3000 },
      },
      {
        id: "step-3",
        serviceCode: "food_license",
        name: "FSSAI License",
        department: "Food Safety (FSSAI)",
        dependencies: ["step-1", "step-2"],
        requiredFields: ["businessName", "address", "foodCategory"],
        optionalFields: ["menuDetails"],
        estimatedDays: 21,
        retryPolicy: { maxRetries: 3, backoffMs: 5000 },
      },
      {
        id: "step-4",
        serviceCode: "municipal_permission",
        name: "Municipal Permission",
        department: "Municipal Corporation",
        dependencies: ["step-1"],
        requiredFields: ["address", "businessName"],
        optionalFields: ["floorPlan"],
        estimatedDays: 14,
        retryPolicy: { maxRetries: 2, backoffMs: 3000 },
      },
      {
        id: "step-5",
        serviceCode: "fire_safety",
        name: "Fire Safety NOC",
        department: "Fire Department",
        dependencies: ["step-4"],
        requiredFields: ["address", "buildingPlan"],
        optionalFields: ["fireExtinguishers"],
        estimatedDays: 10,
        retryPolicy: { maxRetries: 2, backoffMs: 2000 },
      },
      {
        id: "step-6",
        serviceCode: "final_approval",
        name: "Final Compliance",
        department: "Municipal Corporation",
        dependencies: ["step-2", "step-3", "step-4", "step-5"],
        requiredFields: ["businessName", "address"],
        optionalFields: [],
        estimatedDays: 5,
        retryPolicy: { maxRetries: 1, backoffMs: 5000 },
      },
    ],
  },
  {
    id: "template-identity",
    name: "Identity Documents",
    description: "Apply for multiple identity documents",
    category: "identity",
    steps: [
      {
        id: "step-1",
        serviceCode: "aadhaar_update",
        name: "Aadhaar Update",
        department: "UIDAI",
        dependencies: [],
        requiredFields: ["name", "address", "mobile"],
        optionalFields: ["email", "biometrics"],
        estimatedDays: 15,
        retryPolicy: { maxRetries: 3, backoffMs: 2000 },
      },
      {
        id: "step-2",
        serviceCode: "pan_card",
        name: "PAN Card",
        department: "Income Tax",
        dependencies: ["step-1"],
        requiredFields: ["name", "fatherName", "dateOfBirth", "address"],
        optionalFields: ["panNumber"],
        estimatedDays: 7,
        retryPolicy: { maxRetries: 2, backoffMs: 3000 },
      },
      {
        id: "step-3",
        serviceCode: "passport",
        name: "Passport",
        department: "MEA",
        dependencies: ["step-1", "step-2"],
        requiredFields: ["name", "fatherName", "motherName", "dateOfBirth", "address"],
        optionalFields: ["emergencyContact"],
        estimatedDays: 14,
        retryPolicy: { maxRetries: 3, backoffMs: 5000 },
      },
    ],
  },
];

// ─── Workflow Engine ───────────────────────────────────────────

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private templates: Map<string, WorkflowTemplate> = new Map();

  constructor() {
    WORKFLOW_TEMPLATES.forEach((template) => {
      this.templates.set(template.id, template);
    });
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    const defaultWorkflows: Workflow[] = [
      {
        id: "journey-001",
        userId: "citizen-001",
        intent: "I want to open a restaurant in Pune",
        status: "completed",
        progress: 100,
        createdAt: "2026-08-10T10:00:00Z",
        updatedAt: "2026-08-15T16:00:00Z",
        steps: this.createSteps("journey-001", [
          { code: "business_registration", status: "approved" },
          { code: "tax_registration", status: "approved" },
          { code: "food_license", status: "approved" },
          { code: "municipal_permission", status: "approved" },
          { code: "fire_safety", status: "approved" },
          { code: "final_approval", status: "approved" },
        ]),
      },
      {
        id: "journey-002",
        userId: "citizen-002",
        intent: "I want to start a business in Mumbai",
        status: "in_progress",
        progress: 45,
        createdAt: "2026-08-15T14:30:00Z",
        updatedAt: "2026-08-20T10:00:00Z",
        steps: this.createSteps("journey-002", [
          { code: "business_registration", status: "approved" },
          { code: "tax_registration", status: "submitted" },
          { code: "municipal_permission", status: "in_progress" },
        ]),
      },
      {
        id: "journey-003",
        userId: "citizen-001",
        intent: "I need to register a property in Nagpur",
        status: "in_progress",
        progress: 65,
        createdAt: "2026-08-18T09:15:00Z",
        updatedAt: "2026-08-22T14:00:00Z",
        steps: this.createSteps("journey-003", [
          { code: "property_registration", status: "approved" },
          { code: "municipal_permission", status: "approved" },
          { code: "fire_safety", status: "in_progress" },
          { code: "final_approval", status: "waiting" },
        ]),
      },
      {
        id: "journey-004",
        userId: "citizen-002",
        intent: "I want to apply for a passport and driving license",
        status: "created",
        progress: 10,
        createdAt: "2026-08-22T11:00:00Z",
        updatedAt: "2026-08-22T11:00:00Z",
        steps: this.createSteps("journey-004", [
          { code: "passport", status: "pending" },
          { code: "driving_license", status: "waiting" },
        ]),
      },
      {
        id: "journey-005",
        userId: "citizen-001",
        intent: "I want to open a food stall in Pune",
        status: "completed",
        progress: 100,
        createdAt: "2026-07-20T08:00:00Z",
        updatedAt: "2026-07-30T12:00:00Z",
        steps: this.createSteps("journey-005", [
          { code: "business_registration", status: "approved" },
          { code: "food_license", status: "approved" },
          { code: "fire_safety", status: "approved" },
        ]),
      },
      {
        id: "journey-006",
        userId: "citizen-002",
        intent: "I need Aadhaar update and PAN card correction",
        status: "in_progress",
        progress: 30,
        createdAt: "2026-08-20T16:45:00Z",
        updatedAt: "2026-08-23T09:00:00Z",
        steps: this.createSteps("journey-006", [
          { code: "aadhaar_update", status: "in_progress" },
          { code: "pan_card", status: "waiting" },
        ]),
      },
    ];

    defaultWorkflows.forEach((workflow) => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  private createSteps(
    journeyId: string,
    stepConfigs: { code: string; status: string }[]
  ): WorkflowStep[] {
    return stepConfigs.map((config, index) => ({
      id: `step-${journeyId}-${index + 1}`,
      serviceCode: config.code,
      name: config.code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      department: "Government Department",
      dependencies: index > 0 ? [`step-${journeyId}-${index}`] : [],
      requiredFields: [],
      optionalFields: [],
      estimatedDays: 7,
      retryPolicy: { maxRetries: 3, backoffMs: 2000 },
      status: config.status as WorkflowStep["status"],
      sequence: index + 1,
      retryCount: 0,
    }));
  }

  // Create new workflow from template
  createWorkflow(
    userId: string,
    intent: string,
    templateId?: string
  ): Workflow {
    const parsed = parseIntent(intent);
    const template = templateId ? this.templates.get(templateId) : null;

    const steps: WorkflowStep[] = template
      ? template.steps.map((step, index) => ({
          ...step,
          status: "pending" as const,
          sequence: index + 1,
          retryCount: 0,
        }))
      : this.createStepsFromIntent(parsed);

    const workflow: Workflow = {
      id: `journey-${Date.now()}`,
      userId,
      intent,
      intentParsed: parsed,
      steps,
      status: "created",
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  private createStepsFromIntent(parsed: ParsedIntent): WorkflowStep[] {
    return parsed.serviceCodes.map((code, index) => ({
      id: `step-${Date.now()}-${index + 1}`,
      serviceCode: code,
      name: code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      department: "Government Department",
      dependencies: index > 0 ? [`step-${Date.now()}-${index}`] : [],
      requiredFields: [],
      optionalFields: [],
      estimatedDays: 7,
      retryPolicy: { maxRetries: 3, backoffMs: 2000 },
      status: "pending" as const,
      sequence: index + 1,
      retryCount: 0,
    }));
  }

  // Get workflow by ID
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  // Get user workflows
  getUserWorkflows(userId: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(
      (w) => w.userId === userId
    );
  }

  // Get all workflows
  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  // Advance workflow
  advanceWorkflow(workflowId: string): WorkflowStep | null {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    // Find next eligible step
    for (const step of workflow.steps) {
      if (step.status === "waiting" || step.status === "pending") {
        // Check if dependencies are met
        const depsMet = step.dependencies.every((depId) => {
          const depStep = workflow.steps.find((s) => s.id === depId);
          return (
            depStep?.status === "approved" ||
            depStep?.status === "completed" ||
            depStep?.status === "submitted"
          );
        });

        if (depsMet && step.status === "waiting") {
          step.status = "in_progress";
          step.startedAt = new Date().toISOString();
          workflow.status = "in_progress";
          workflow.updatedAt = new Date().toISOString();
          return step;
        }
      }
    }

    // Check if all steps are done
    const allDone = workflow.steps.every(
      (s) => s.status === "approved" || s.status === "completed"
    );

    if (allDone) {
      workflow.status = "completed";
      workflow.progress = 100;
      workflow.updatedAt = new Date().toISOString();
    }

    return null;
  }

  // Get templates
  getTemplates(): WorkflowTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get workflow statistics
  getStats(): {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    avgProgress: number;
  } {
    const workflows = this.getAllWorkflows();
    const total = workflows.length;
    const completed = workflows.filter((w) => w.status === "completed").length;
    const inProgress = workflows.filter((w) => w.status === "in_progress").length;
    const failed = workflows.filter((w) => w.status === "failed").length;
    const avgProgress =
      total > 0
        ? Math.round(
            workflows.reduce((sum, w) => sum + w.progress, 0) / total
          )
        : 0;

    return { total, completed, inProgress, failed, avgProgress };
  }
}
