// ─── OneGov AI Engine — Core Types ─────────────────────────────
// Production-ready type system that can work with any LLM provider

// ─── Intent Types ──────────────────────────────────────────────

export type IntentCategory =
  | "OPEN_RESTAURANT"
  | "OPEN_FOOD_BUSINESS"
  | "START_BUSINESS"
  | "REGISTER_COMPANY"
  | "GET_PASSPORT"
  | "GET_DRIVING_LICENSE"
  | "UPDATE_AADHAAR"
  | "GET_PAN_CARD"
  | "REGISTER_VOTER_ID"
  | "PROPERTY_REGISTRATION"
  | "BIRTH_CERTIFICATE"
  | "DEATH_CERTIFICATE"
  | "MARRIAGE_REGISTRATION"
  | "INCOME_CERTIFICATE"
  | "CASTE_CERTIFICATE"
  | "RATION_CARD"
  | "GOVERNMENT_SCHEME"
  | "RTI_INFO"
  | "FILE_GRIEVANCE"
  | "GST_INFO"
  | "GENERAL_HELP"
  | "GENERAL_INQUIRY"
  | "UNKNOWN";

export interface ExtractedEntities {
  intent: IntentCategory;
  confidence: number;
  location: {
    state: string | null;
    city: string | null;
  };
  businessType: string | null;
  businessStructure: string | null;
  serviceType: string | null;
  keywords: string[];
  missingCriticalInfo: string[];
}

// ─── Conversation Types ────────────────────────────────────────

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    intent?: IntentCategory;
    entities?: Partial<ExtractedEntities>;
    toolsCalled?: string[];
    workflowGenerated?: boolean;
  };
}

export interface ConversationContext {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  currentIntent: IntentCategory | null;
  collectedEntities: Partial<ExtractedEntities>;
  workflowId: string | null;
  stage:
    | "greeting"
    | "collecting_info"
    | "confirming_intent"
    | "workflow_generated"
    | "in_progress"
    | "completed";
  createdAt: string;
  updatedAt: string;
}

// ─── AI Response Types ─────────────────────────────────────────

export type AIResponseType =
  | "message"
  | "question"
  | "workflow"
  | "error"
  | "clarification";

export interface AIResponse {
  type: AIResponseType;
  content: string;
  metadata?: {
    intent?: IntentCategory;
    confidence?: number;
    entities?: Partial<ExtractedEntities>;
    workflow?: WorkflowData;
    followUpQuestions?: string[];
    toolsCalled?: string[];
  };
}

export interface WorkflowData {
  id: string;
  title: string;
  description: string;
  location: string;
  totalSteps: number;
  estimatedDays: number;
  steps: WorkflowStepData[];
}

export interface WorkflowStepData {
  id: string;
  sequence: number;
  title: string;
  serviceCode: string;
  department: string;
  description: string;
  status: "pending" | "blocked" | "ready" | "in_progress" | "completed";
  dependencies: string[];
  requiredDocuments: string[];
  requiredFields: string[];
  estimatedDays: number;
  blockedBy?: string[];
}

// ─── Tool Types ────────────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      description: string;
      required: boolean;
      enum?: string[];
    }
  >;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolName: string;
  success: boolean;
  data: unknown;
  error?: string;
}

// ─── RAG Types ─────────────────────────────────────────────────

export interface ServiceDocument {
  id: string;
  serviceCode: string;
  name: string;
  department: string;
  description: string;
  category: string;
  keywords: string[];
  requiredDocuments: string[];
  requiredFields: string[];
  eligibility: string[];
  prerequisites: string[];
  estimatedDays: number;
  officialPortal: string | null;
  embedding?: number[];
}

export interface RetrievalResult {
  document: ServiceDocument;
  score: number;
}

// ─── AI Provider Interface ─────────────────────────────────────

export interface AIProvider {
  /**
   * Generate a response based on conversation context
   */
  generateResponse(context: ConversationContext): Promise<AIResponse>;

  /**
   * Extract intent and entities from user input
   */
  extractIntent(
    userMessage: string,
    context?: ConversationContext
  ): Promise<ExtractedEntities>;

  /**
   * Generate a workflow from confirmed intent and entities
   */
  generateWorkflow(
    intent: IntentCategory,
    entities: ExtractedEntities
  ): Promise<WorkflowData>;

  /**
   * Process a tool call and return the result
   */
  processToolCall(toolCall: ToolCall, context: ConversationContext): Promise<ToolResult>;
}
