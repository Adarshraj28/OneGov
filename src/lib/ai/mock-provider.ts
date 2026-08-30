// ─── OneGov AI Engine — Mock AI Provider ───────────────────────
// Sophisticated NLP-like AI that handles natural language understanding
// Production-ready architecture — swap this for a real LLM provider later

import type {
  AIProvider,
  AIResponse,
  ConversationContext,
  ExtractedEntities,
  IntentCategory,
  WorkflowData,
  WorkflowStepData,
  ToolCall,
  ToolResult,
} from "./types";
import { getRAGRetriever } from "./rag";
import { executeToolCall } from "./tools";

// ─── Intent Classification Engine ──────────────────────────────

interface IntentPattern {
  intent: IntentCategory;
  patterns: RegExp[];
  keywords: string[];
  requiredContext: string[];
  weight: number;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    intent: "OPEN_RESTAURANT",
    patterns: [
      /open(?:ing)?\s+(?:a\s+)?(?:new\s+)?restaurant/i,
      /start(?:ing)?\s+(?:a\s+)?(?:new\s+)?restaurant/i,
      /restaurant\s+(?:business|setup|open|start)/i,
      /(?:want|plan|looking)\s+to\s+(?:open|start)\s+(?:a\s+)?restaurant/i,
      /food\s+(?:business|stall|shop|outlet)\s+(?:in|at)/i,
      /cafe|eatery|dhaba|food\s+truck|cloud\s+kitchen/i,
      /open(?:ing)?\s+(?:a\s+)?(?:new\s+)?cafe/i,
      /start(?:ing)?\s+(?:a\s+)?(?:new\s+)?cafe/i,
    ],
    keywords: ["restaurant", "cafe", "eatery", "dining", "food business", "food stall", "cloud kitchen", "food truck", "canteen", "mess"],
    requiredContext: ["location"],
    weight: 1.0,
  },
  {
    intent: "OPEN_FOOD_BUSINESS",
    patterns: [
      /(?:open|start|begin)\s+(?:a\s+)?(?:food|bakery|sweet|snack|catering)/i,
      /food\s+(?:processing|manufacturing|production)/i,
      /bakery|sweet\s+shop|catering\s+business/i,
    ],
    keywords: ["food business", "bakery", "sweet", "catering", "food processing", "food manufacturing"],
    requiredContext: ["location"],
    weight: 0.9,
  },
  {
    intent: "START_BUSINESS",
    patterns: [
      /(?:open|start|begin|launch)\s+(?:a\s+)?(?:new\s+)?(?:small\s+)?(?:\w+\s+)?business/i,
      /(?:want|plan|looking)\s+to\s+(?:start|open|begin)\s+(?:a\s+)?(?:new\s+)?(?:small\s+)?(?:\w+\s+)?business/i,
      /(?:start|open)\s+(?:a\s+)?(?:new\s+)?(?:\w+\s+)?(?:shop|store|firm|enterprise|company)/i,
      /business\s+(?:registration|setup|incorporation)/i,
      /register\s+(?:my\s+)?(?:new\s+)?business/i,
    ],
    keywords: ["business", "startup", "company", "firm", "enterprise", "shop", "store", "trade"],
    requiredContext: ["location", "businessType"],
    weight: 0.8,
  },
  {
    intent: "REGISTER_COMPANY",
    patterns: [
      /register\s+(?:a\s+)?(?:private\s+limited|pvt\s+ltd|llp|partnership|company)/i,
      /(?:incorporate|form)\s+(?:a\s+)?company/i,
      /company\s+registration/i,
      /private\s+limited|pvt\s+ltd|llp/i,
    ],
    keywords: ["private limited", "pvt ltd", "llp", "partnership", "company registration", "incorporation"],
    requiredContext: ["location"],
    weight: 0.85,
  },
  {
    intent: "GET_PASSPORT",
    patterns: [
      /(?:apply|get|obtain|renew)\s+(?:for\s+)?(?:a\s+)?passport/i,
      /passport\s+(?:application|renewal|reissue|apply)/i,
      /new\s+passport|passport\s+renewal/i,
      /(?:want|need)\s+(?:a\s+)?passport/i,
    ],
    keywords: ["passport", "travel document", "passport seva", "international travel"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "GET_DRIVING_LICENSE",
    patterns: [
      /(?:apply|get|obtain|renew)\s+(?:for\s+)?(?:a\s+)?(?:driving\s+license|dl)/i,
      /driving\s+license\s+(?:application|renewal)/i,
      /(?:learner|permanent)\s+(?:driving\s+)?license/i,
      /(?:want|need)\s+(?:a\s+)?(?:driving\s+)?license/i,
    ],
    keywords: ["driving license", "dl", "learner license", "permanent license", "parivahan", "vehicle license"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "UPDATE_AADHAAR",
    patterns: [
      /(?:update|correct|change)\s+(?:my\s+)?aadhaar/i,
      /aadhaar\s+(?:update|correction|change|modify)/i,
      /(?:new\s+)?aadhaar\s+(?:card|enrollment|registration)/i,
      /(?:apply|get)\s+(?:for\s+)?(?:a\s+)?(?:new\s+)?aadhaar/i,
      /(?:want|need)\s+(?:to\s+)?(?:update|get|apply)\s+.*aadhaar/i,
    ],
    keywords: ["aadhaar", "aadhaar card", "uidai", "aadhaar update", "aadhaar enrollment", "aadhaar correction"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "GET_PAN_CARD",
    patterns: [
      /(?:apply|get|obtain|correct)\s+(?:for\s+)?(?:a\s+)?pan\s*(?:card)?/i,
      /pan\s+(?:card|number)\s+(?:application|correction|reprint)/i,
      /(?:new\s+)?pan\s+card/i,
      /(?:want|need)\s+(?:a\s+)?pan\s*(?:card)?/i,
    ],
    keywords: ["pan", "pan card", "pan number", "nsdl", "utiitsl", "permanent account number"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "REGISTER_VOTER_ID",
    patterns: [
      /(?:apply|get|register|update)\s+(?:for\s+)?(?:a\s+)?voter\s*(?:id|card)?/i,
      /voter\s+(?:id|card|registration|registration)/i,
      /(?:new\s+)?voter\s+(?:id|registration)/i,
      /election\s+commission|nvsp/i,
    ],
    keywords: ["voter", "voter id", "voter card", "election", "electoral", "nvsp", "voting"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "PROPERTY_REGISTRATION",
    patterns: [
      /(?:register|buy|sell|purchase)\s+(?:a\s+)?property/i,
      /property\s+(?:registration|transfer|sale)/i,
      /(?:sale\s+deed|sub\s*registrar|stamp\s+duty)/i,
      /(?:buy|purchase)\s+(?:a\s+)?(?:house|flat|land|plot|property)/i,
    ],
    keywords: ["property", "registration", "sale deed", "land", "house", "flat", "real estate", "sub registrar", "stamp duty", "property transfer"],
    requiredContext: ["location"],
    weight: 0.85,
  },
  {
    intent: "BIRTH_CERTIFICATE",
    patterns: [
      /(?:apply|get|obtain|register)\s+(?:for\s+)?(?:a\s+)?birth\s+certificate/i,
      /birth\s+(?:certificate|registration)/i,
      /(?:new\s+)?birth\s+certificate/i,
    ],
    keywords: ["birth certificate", "birth registration", "janam praman patra"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "MARRIAGE_REGISTRATION",
    patterns: [
      /(?:register|get)\s+(?:my\s+)?marriage/i,
      /marriage\s+(?:registration|certificate|register)/i,
      /(?:get|obtain)\s+(?:a\s+)?marriage\s+certificate/i,
    ],
    keywords: ["marriage", "marriage registration", "wedding", "marriage certificate"],
    requiredContext: [],
    weight: 0.9,
  },
  {
    intent: "INCOME_CERTIFICATE",
    patterns: [
      /(?:apply|get|obtain)\s+(?:for\s+)?(?:an?\s+)?income\s+certificate/i,
      /income\s+(?:certificate|proof)/i,
    ],
    keywords: ["income certificate", "income proof", "salary certificate"],
    requiredContext: [],
    weight: 0.85,
  },
  {
    intent: "CASTE_CERTIFICATE",
    patterns: [
      /(?:apply|get|obtain)\s+(?:for\s+)?(?:a\s+)?caste\s+certificate/i,
      /caste\s+(?:certificate|proof)/i,
    ],
    keywords: ["caste certificate", "caste proof", "sc st obc certificate"],
    requiredContext: [],
    weight: 0.85,
  },
  {
    intent: "RATION_CARD",
    patterns: [
      /(?:apply|get|obtain)\s+(?:for\s+)?(?:a\s+)?ration\s+card/i,
      /ration\s+(?:card|application)/i,
    ],
    keywords: ["ration card", "ration", "food card", "bpl card"],
    requiredContext: [],
    weight: 0.85,
  },
];

// ─── Entity Extraction ─────────────────────────────────────────

const INDIAN_STATES = [
  "maharashtra", "karnataka", "tamil nadu", "delhi", "gujarat",
  "rajasthan", "uttar pradesh", "madhya pradesh", "west bengal",
  "andhra pradesh", "telangana", "kerala", "punjab", "haryana",
  "bihar", "odisha", "jharkhand", "chhattisgarh", "assam", "goa",
  "himachal pradesh", "uttarakhand", "jammu and kashmir", "ladakh",
  "meghalaya", "manipur", "mizoram", "nagaland", "tripura",
  "arunachal pradesh", "sikkim",
];

const INDIAN_CITIES: Record<string, string> = {
  pune: "maharashtra", mumbai: "maharashtra", nagpur: "maharashtra",
  nashik: "maharashtra", aurangabad: "maharashtra", thane: "maharashtra",
  bangalore: "karnataka", mysore: "karnataka", hubli: "karnataka",
  chennai: "tamil nadu", coimbatore: "tamil nadu",
  delhi: "delhi", "new delhi": "delhi",
  ahmedabad: "gujarat", surat: "gujarat", vadodara: "gujarat",
  jaipur: "rajasthan", jodhpur: "rajasthan",
  lucknow: "uttar pradesh", noida: "uttar pradesh", varanasi: "uttar pradesh",
  kolkata: "west bengal",
  hyderabad: "telangana",
  thiruvananthapuram: "kerala", kochi: "kerala",
  chandigarh: "punjab",
  patna: "bihar",
  bhubaneswar: "odisha",
  ranchi: "jharkhand",
  raipur: "chhattisgarh",
  guwahati: "assam",
  panaji: "goa",
  shimla: "himachal pradesh",
  dehradun: "uttarakhand",
};

const BUSINESS_TYPES = [
  "restaurant", "cafe", "bakery", "food stall", "food truck",
  "cloud kitchen", "catering", "sweet shop", "dhaba",
  "clothing store", "retail shop", "grocery store", "electronics store",
  "pharmacy", "hardware store", "stationery shop",
  "consulting firm", "IT company", "digital agency",
  "manufacturing unit", "trading company", "import export",
  "gym", "fitness center", "salon", "spa",
  "coaching center", "tuition classes", "training institute",
  "medical practice", "legal practice", "accounting firm",
];

const BUSINESS_STRUCTURES = [
  "sole proprietorship", "partnership", "llp", "private limited",
  "public limited", "one person company", "opc",
  "huf", "cooperative society", "trust",
  "sole proprietor", "partnership firm",
];

function extractLocation(text: string): { state: string | null; city: string | null } {
  const lower = text.toLowerCase();
  let city: string | null = null;
  let state: string | null = null;

  // Check cities first (more specific)
  for (const [cityName, stateName] of Object.entries(INDIAN_CITIES)) {
    if (lower.includes(cityName)) {
      city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      state = stateName.charAt(0).toUpperCase() + stateName.slice(1);
      break;
    }
  }

  // Check states if no city found
  if (!state) {
    for (const stateName of INDIAN_STATES) {
      if (lower.includes(stateName)) {
        state = stateName.charAt(0).toUpperCase() + stateName.slice(1);
        break;
      }
    }
  }

  // Check for "in [Location]" pattern
  const inMatch = lower.match(/\b(?:in|at|from)\s+([a-z\s]+?)(?:\.|,|\?|$)/);
  if (inMatch && !city) {
    const potentialLocation = inMatch[1].trim();
    if (INDIAN_CITIES[potentialLocation]) {
      city = potentialLocation.charAt(0).toUpperCase() + potentialLocation.slice(1);
      state = INDIAN_CITIES[potentialLocation].charAt(0).toUpperCase() + INDIAN_CITIES[potentialLocation].slice(1);
    }
  }

  return { state, city };
}

function extractBusinessType(text: string): string | null {
  const lower = text.toLowerCase();
  for (const type of BUSINESS_TYPES) {
    if (lower.includes(type)) {
      return type;
    }
  }
  return null;
}

function extractBusinessStructure(text: string): string | null {
  const lower = text.toLowerCase();
  for (const structure of BUSINESS_STRUCTURES) {
    if (lower.includes(structure)) {
      return structure;
    }
  }
  return null;
}

function classifyIntent(text: string): { intent: IntentCategory; confidence: number } {
  const lower = text.toLowerCase();
  let bestMatch: { intent: IntentCategory; confidence: number } = {
    intent: "GENERAL_INQUIRY",
    confidence: 0,
  };

  for (const pattern of INTENT_PATTERNS) {
    let regexHits = 0;
    let keywordHits = 0;

    // Check regex patterns (high weight)
    for (const regex of pattern.patterns) {
      if (regex.test(text)) {
        regexHits++;
      }
    }

    // Check keyword matches
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        keywordHits++;
      }
    }

    // Calculate confidence based on HITS, not total possible
    // A single regex match + keyword match = strong signal
    const totalHits = regexHits * 3 + keywordHits;
    if (totalHits === 0) continue;

    // Base confidence from hits, boosted by weight
    let confidence: number;
    if (regexHits > 0) {
      // Regex match is a strong signal — base 0.6, add for keywords
      confidence = Math.min(0.6 + keywordHits * 0.08, 0.98) * pattern.weight;
    } else {
      // Only keyword matches — weaker signal
      confidence = Math.min(keywordHits * 0.12, 0.7) * pattern.weight;
    }

    if (confidence > bestMatch.confidence && confidence > 0.15) {
      bestMatch = { intent: pattern.intent, confidence };
    }
  }

  return bestMatch;
}

// ─── Response Templates ────────────────────────────────────────

function generateGreeting(): string {
  return `Hello! I'm your OneGov assistant. I can help you navigate government services — from starting a business to applying for documents.\n\nWhat would you like to accomplish today?`;
}

function generateFollowUpForLocation(intent: IntentCategory): string {
  const intentName = intent.replace(/_/g, " ").toLowerCase();
  return `Great! I can help you with ${intentName}.\n\nWhich city and state will this be in? For example: "Pune, Maharashtra" or "Bangalore, Karnataka".`;
}

function generateFollowUpForBusinessType(): string {
  return `What type of business are you planning to start?\n\nFor example: restaurant, cafe, clothing store, consulting firm, grocery store, etc.`;
}

function generateFollowUpForBusinessStructure(): string {
  return `How would you like to structure your business?\n\n• **Sole Proprietorship** — simplest, one owner\n• **Partnership** — two or more owners\n• **LLP (Limited Liability Partnership)** — liability protection\n• **Private Limited Company** — separate legal entity\n\nWhich structure suits you?`;
}

function generateConfirmation(
  intent: IntentCategory,
  entities: ExtractedEntities
): string {
  const intentName = intent
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  let details = [];
  if (entities.location?.city) details.push(`City: ${entities.location.city}`);
  if (entities.location?.state) details.push(`State: ${entities.location.state}`);
  if (entities.businessType) details.push(`Type: ${entities.businessType}`);
  if (entities.businessStructure) details.push(`Structure: ${entities.businessStructure}`);

  return `I understand you want to **${intentName}**.\n\n${details.length > 0 ? `Here's what I've gathered:\n${details.map((d) => `• ${d}`).join("\n")}\n\n` : ""}Is this correct? If so, I'll build your complete government-service roadmap. Or let me know if you'd like to change anything.`;
}

function generateWorkflowPresentation(workflow: WorkflowData): string {
  const lines: string[] = [];

  lines.push(`## ${workflow.title}`);
  lines.push("");
  lines.push(`Your personalized government-service roadmap for **${workflow.title.toLowerCase()}** in **${workflow.location}**.`);
  lines.push("");
  lines.push(`**Total Steps:** ${workflow.totalSteps} • **Estimated Time:** ~${workflow.estimatedDays} days`);
  lines.push("");
  lines.push("### Roadmap");
  lines.push("");

  for (const step of workflow.steps) {
    const statusIcon = step.status === "ready" ? "🔵" : step.status === "blocked" ? "🔒" : "⏳";
    const deps =
      step.dependencies.length > 0
        ? ` (depends on: ${step.dependencies.join(", ")})`
        : "";

    lines.push(`${statusIcon} **Step ${step.sequence}: ${step.title}**`);
    lines.push(`   ${step.department}`);
    lines.push(`   Est. ${step.estimatedDays} days${deps}`);
    lines.push("");
  }

  lines.push("Each step is actionable — you can start working through them one by one.");
  lines.push("I'll guide you through requirements, documents, and submissions as you go.");

  return lines.join("\n");
}

function generateStepDetails(
  step: WorkflowStepData,
  context: ConversationContext
): string {
  const lines: string[] = [];

  lines.push(`### ${step.title}`);
  lines.push(`**Department:** ${step.department}`);
  lines.push(`**Estimated Time:** ${step.estimatedDays} days`);
  lines.push("");

  if (step.requiredDocuments.length > 0) {
    lines.push("**Documents Required:**");
    for (const doc of step.requiredDocuments) {
      lines.push(`• ${doc}`);
    }
    lines.push("");
  }

  if (step.requiredFields.length > 0) {
    lines.push("**Information Needed:**");
    for (const field of step.requiredFields) {
      lines.push(`• ${field}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Mock AI Provider Implementation ───────────────────────────

export class MockAIProvider implements AIProvider {
  private rag = getRAGRetriever();

  async generateResponse(context: ConversationContext): Promise<AIResponse> {
    const lastUserMessage = [...context.messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMessage) {
      return {
        type: "message",
        content: generateGreeting(),
        metadata: { followUpQuestions: ["What would you like to accomplish?"] },
      };
    }

    const userText = lastUserMessage.content;

    // Check for greetings
    const greetingPatterns = /^(hi|hello|hey|good morning|good afternoon|good evening|namaste|hola|howdy|greetings)/i;
    if (greetingPatterns.test(userText.trim()) && context.stage === "greeting" && context.messages.length <= 2) {
      return {
        type: "message",
        content: generateGreeting(),
        metadata: { followUpQuestions: ["What would you like to accomplish?"] },
      };
    }

    // Check for confirmation responses
    const confirmationPatterns = /^(yes|yeah|yep|correct|right|sure|ok|okay|proceed|go ahead|looks good|that's right|confirm)/i;
    const denialPatterns = /^(no|nah|nope|wrong|incorrect|cancel|back|change)/i;

    if (confirmationPatterns.test(userText.trim())) {
      return this.handleConfirmation(context);
    }

    if (denialPatterns.test(userText.trim())) {
      return this.handleDenial(context);
    }

    // Check for "what documents" or "what do I need" type questions
    const infoQuestionPatterns = /(?:what|which|tell me|show me).*(?:document|require|need|prerequisite|depend)/i;
    if (infoQuestionPatterns.test(userText)) {
      return this.handleInfoQuestion(userText, context);
    }

    // Check for step-related questions (only match explicit step references)
    const stepQuestionPattern = /^(?:step|show step|tell me about step|what about step)\s*(\d+)?/i;
    if (stepQuestionPattern.test(userText.trim())) {
      return this.handleStepQuestion(userText, context);
    }

    // Main intent classification
    const { intent, confidence } = classifyIntent(userText);

    // If no intent found with reasonable confidence, ask for clarification
    if (confidence < 0.3) {
      return this.handleUnclearIntent(userText, context);
    }

    // Extract entities
    const location = extractLocation(userText);
    const businessType = extractBusinessType(userText);
    const businessStructure = extractBusinessStructure(userText);

    // Update context entities
    const newEntities: Partial<ExtractedEntities> = {};
    if (location.state || location.city) newEntities.location = location;
    if (businessType) newEntities.businessType = businessType;
    if (businessStructure) newEntities.businessStructure = businessStructure;
    newEntities.intent = intent;
    newEntities.confidence = confidence;

    // Check what we still need
    const intentPattern = INTENT_PATTERNS.find((p) => p.intent === intent);
    const missingContext: string[] = [];

    if (intentPattern) {
      for (const ctx of intentPattern.requiredContext) {
        if (ctx === "location" && !location.state && !location.city) {
          missingContext.push("location");
        }
        if (ctx === "businessType" && !businessType) {
          missingContext.push("businessType");
        }
      }
    }

    // Determine conversation stage and generate appropriate response
    if (context.stage === "greeting" || context.stage === "collecting_info") {
      // If we have enough info, generate workflow
      if (missingContext.length === 0) {
        context.currentIntent = intent;
        context.collectedEntities = {
          ...context.collectedEntities,
          ...newEntities,
        };
        context.stage = "confirming_intent";

        return {
          type: "message",
          content: generateConfirmation(intent, context.collectedEntities as ExtractedEntities),
          metadata: {
            intent,
            confidence,
            entities: context.collectedEntities,
          },
        };
      }

      // Ask for missing info
      context.currentIntent = intent;
      context.collectedEntities = {
        ...context.collectedEntities,
        ...newEntities,
      };
      context.stage = "collecting_info";

      let followUp = "";
      if (missingContext.includes("location")) {
        followUp = generateFollowUpForLocation(intent);
      } else if (missingContext.includes("businessType")) {
        followUp = generateFollowUpForBusinessType();
      }

      return {
        type: "question",
        content: followUp,
        metadata: {
          intent,
          confidence,
          entities: context.collectedEntities,
          followUpQuestions: missingContext,
        },
      };
    }

    // Default: ask for clarification
    return {
      type: "clarification",
      content: `I want to make sure I understand correctly. Could you tell me more about what you'd like to do?\n\nFor example:\n• "I want to open a restaurant in Pune"\n• "I need a passport"\n• "I want to start a clothing business in Mumbai"`,
      metadata: { intent, confidence },
    };
  }

  async extractIntent(
    userMessage: string,
    context?: ConversationContext
  ): Promise<ExtractedEntities> {
    const { intent, confidence } = classifyIntent(userMessage);
    const location = extractLocation(userMessage);
    const businessType = extractBusinessType(userMessage);
    const businessStructure = extractBusinessStructure(userMessage);

    return {
      intent,
      confidence,
      location,
      businessType,
      businessStructure,
      serviceType: null,
      keywords: tokenizeSimple(userMessage),
      missingCriticalInfo: [],
    };
  }

  async generateWorkflow(
    intent: IntentCategory,
    entities: ExtractedEntities
  ): Promise<WorkflowData> {
    // Map intent to service codes
    const serviceCodeMap: Record<string, string[]> = {
      OPEN_RESTAURANT: [
        "business_registration",
        "tax_registration",
        "food_license",
        "municipal_permission",
        "fire_safety",
        "shop_establishment",
      ],
      OPEN_FOOD_BUSINESS: [
        "business_registration",
        "tax_registration",
        "food_license",
        "municipal_permission",
      ],
      START_BUSINESS: [
        "business_registration",
        "tax_registration",
        "municipal_permission",
        "shop_establishment",
      ],
      REGISTER_COMPANY: [
        "business_registration",
        "tax_registration",
        "shop_establishment",
      ],
      GET_PASSPORT: ["passport"],
      GET_DRIVING_LICENSE: ["driving_license"],
      UPDATE_AADHAAR: ["aadhaar_update"],
      GET_PAN_CARD: ["pan_card"],
      REGISTER_VOTER_ID: ["voter_id"],
      PROPERTY_REGISTRATION: [
        "property_registration",
        "municipal_permission",
      ],
      BIRTH_CERTIFICATE: ["birth_certificate"],
      MARRIAGE_REGISTRATION: ["marriage_registration"],
      INCOME_CERTIFICATE: ["income_certificate"],
      CASTE_CERTIFICATE: ["caste_certificate"],
      RATION_CARD: ["ration_card"],
    };

    const serviceCodes = serviceCodeMap[intent] || ["business_registration"];

    // Build workflow steps with dependency resolution
    const steps: WorkflowStepData[] = serviceCodes.map((code, index) => {
      const doc = this.rag.getService(code);
      const mockService = (MOCK_SERVICES_FOR_AI).find((s) => s.code === code);

      // Determine dependencies based on service relationships
      const dependencies: string[] = [];
      if (index > 0) {
        // Simple linear dependency for most cases
        dependencies.push(`step-${index}`);
      }
      // Special cases
      if (code === "food_license") {
        dependencies.push("step-1"); // Depends on business registration
      }
      if (code === "fire_safety") {
        dependencies.push(`step-${serviceCodes.indexOf("municipal_permission") + 1}`);
      }

      return {
        id: `step-${index + 1}`,
        sequence: index + 1,
        title: doc?.name || mockService?.name || code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        serviceCode: code,
        department: doc?.department || mockService?.department?.name || "Government Department",
        description: doc?.description || mockService?.description || "",
        status: index === 0 ? "ready" : "pending",
        dependencies: dependencies.filter((d, i, a) => a.indexOf(d) === i),
        requiredDocuments: doc?.requiredDocuments || mockService?.requiredDocuments || [],
        requiredFields: doc?.requiredFields || mockService?.requiredFields || [],
        estimatedDays: doc?.estimatedDays || mockService?.estimatedDays || 7,
      };
    });

    // Update statuses based on dependencies
    for (const step of steps) {
      if (step.dependencies.length > 0) {
        step.status = "blocked";
        step.blockedBy = step.dependencies;
      }
    }
    if (steps.length > 0) {
      steps[0].status = "ready";
    }

    const locationStr = entities.location?.city && entities.location?.state
      ? `${entities.location.city}, ${entities.location.state}`
      : entities.location?.state || entities.location?.city || "India";

    return {
      id: `workflow-${Date.now()}`,
      title: intent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `Complete government-service workflow for ${intent.replace(/_/g, " ").toLowerCase()}`,
      location: locationStr,
      totalSteps: steps.length,
      estimatedDays: steps.reduce((sum, s) => sum + s.estimatedDays, 0),
      steps,
    };
  }

  async processToolCall(
    toolCall: ToolCall,
    context: ConversationContext
  ): Promise<ToolResult> {
    return executeToolCall(toolCall, context);
  }

  // ─── Private Helper Methods ─────────────────────────────────

  private handleConfirmation(context: ConversationContext): AIResponse {
    if (
      context.stage === "confirming_intent" &&
      context.currentIntent
    ) {
      // Generate the workflow
      const entities: ExtractedEntities = {
        intent: context.currentIntent,
        confidence: 0.9,
        location: context.collectedEntities.location || { state: null, city: null },
        businessType: context.collectedEntities.businessType || null,
        businessStructure: context.collectedEntities.businessStructure || null,
        serviceType: context.collectedEntities.serviceType || null,
        keywords: [],
        missingCriticalInfo: [],
      };

      // Use a mock workflow generation (in production, this calls generateWorkflow)
      const serviceCodeMap: Record<string, string[]> = {
        OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
        START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
        GET_PASSPORT: ["passport"],
        GET_DRIVING_LICENSE: ["driving_license"],
        UPDATE_AADHAAR: ["aadhaar_update"],
        GET_PAN_CARD: ["pan_card"],
      };

      const serviceCodes = serviceCodeMap[context.currentIntent] || ["business_registration"];

      const steps: WorkflowStepData[] = serviceCodes.map((code, index) => {
        const doc = this.rag.getService(code);
        return {
          id: `step-${index + 1}`,
          sequence: index + 1,
          title: doc?.name || code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          serviceCode: code,
          department: doc?.department || "Government Department",
          description: doc?.description || "",
          status: index === 0 ? "ready" : "blocked",
          dependencies: index > 0 ? [`step-${index}`] : [],
          requiredDocuments: doc?.requiredDocuments || [],
          requiredFields: doc?.requiredFields || [],
          estimatedDays: doc?.estimatedDays || 7,
          blockedBy: index > 0 ? [`step-${index}`] : undefined,
        };
      });

      const locationStr = entities.location?.city && entities.location?.state
        ? `${entities.location.city}, ${entities.location.state}`
        : entities.location?.state || "India";

      const workflow: WorkflowData = {
        id: `workflow-${Date.now()}`,
        title: context.currentIntent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: `Complete government-service workflow`,
        location: locationStr,
        totalSteps: steps.length,
        estimatedDays: steps.reduce((sum, s) => sum + s.estimatedDays, 0),
        steps,
      };

      context.stage = "workflow_generated";
      context.workflowId = workflow.id;

      return {
        type: "workflow",
        content: generateWorkflowPresentation(workflow),
        metadata: {
          intent: context.currentIntent,
          entities: context.collectedEntities,
          workflow,
          followUpQuestions: [
            "Tell me about Step 1",
            "What documents do I need?",
            "Show me my progress",
          ],
        },
      };
    }

    return {
      type: "message",
      content: "I'm ready to help! What would you like to accomplish?",
    };
  }

  private handleDenial(context: ConversationContext): AIResponse {
    context.stage = "greeting";
    context.collectedEntities = {
      location: { state: null, city: null },
      businessType: null,
      businessStructure: null,
      serviceType: null,
    };
    context.currentIntent = null;

    return {
      type: "message",
      content: "No problem! Let's start over. What would you like to accomplish? You can describe it naturally — for example:\n\n• \"I want to open a restaurant in Pune\"\n• \"I need a passport\"\n• \"I want to start a business\"",
    };
  }

  private handleInfoQuestion(userText: string, context: ConversationContext): AIResponse {
    // If we have a workflow, show step details
    if (context.stage === "workflow_generated" && context.currentIntent) {
      // Try to find which step they're asking about
      const stepMatch = userText.match(/step\s*(\d+)/i);
      if (stepMatch) {
        const stepNum = parseInt(stepMatch[1]);
        const serviceCodesMap: Record<string, string[]> = {
          OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
          START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
        };
        const codes = serviceCodesMap[context.currentIntent] || ["business_registration"];
        const code = codes[stepNum - 1];
        if (code) {
          const doc = this.rag.getService(code);
          if (doc) {
            const step: WorkflowStepData = {
              id: `step-${stepNum}`,
              sequence: stepNum,
              title: doc.name,
              serviceCode: code,
              department: doc.department,
              description: doc.description,
              status: "ready",
              dependencies: [],
              requiredDocuments: doc.requiredDocuments,
              requiredFields: doc.requiredFields,
              estimatedDays: doc.estimatedDays,
            };
            return {
              type: "message",
              content: generateStepDetails(step, context),
            };
          }
        }
      }

      // General document question
      const allDocs = new Set<string>();
      const serviceCodesMap2: Record<string, string[]> = {
        OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
        START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
      };
      const codes2 = serviceCodesMap2[context.currentIntent] || [];
      for (const code of codes2) {
        const doc = this.rag.getService(code);
        if (doc) {
          for (const d of doc.requiredDocuments) {
            allDocs.add(d);
          }
        }
      }

      if (allDocs.size > 0) {
        return {
          type: "message",
          content: `Here are the documents you'll need across your entire journey:\n\n${Array.from(allDocs).map((d) => `• ${d}`).join("\n")}\n\nYou can reuse documents across multiple steps — once uploaded, they're saved to your profile.\n\nWhich step would you like to start with?`,
        };
      }
    }

    return {
      type: "message",
      content: "Could you tell me which step or service you'd like to know more about? I can show you the required documents, eligibility, and process details.",
    };
  }

  private handleStepQuestion(userText: string, context: ConversationContext): AIResponse {
    if (context.stage === "workflow_generated") {
      return {
        type: "message",
        content: "Your workflow is ready! You can start with **Step 1** by navigating to your journey dashboard.\n\nEach step will guide you through the required documents, information, and submission process.\n\nWould you like me to walk you through Step 1 in detail?",
      };
    }

    return {
      type: "message",
      content: "Let's first figure out what you'd like to accomplish, and I'll build your step-by-step roadmap.\n\nWhat would you like to do?",
    };
  }

  private handleUnclearIntent(userText: string, context: ConversationContext): AIResponse {
    // Check if it's a follow-up to something we were discussing
    if (context.currentIntent && context.stage === "collecting_info") {
      // Maybe they're answering our location question
      const location = extractLocation(userText);
      if (location.state || location.city) {
        context.collectedEntities.location = location;

        // Check if we now have everything
        const intentPattern = INTENT_PATTERNS.find((p) => p.intent === context.currentIntent);
        const stillMissing: string[] = [];
        if (intentPattern) {
          for (const ctx of intentPattern.requiredContext) {
            if (ctx === "location" && !location.state && !location.city) {
              stillMissing.push("location");
            }
          }
        }

        if (stillMissing.length === 0) {
          context.stage = "confirming_intent";
          return {
            type: "message",
            content: generateConfirmation(context.currentIntent!, context.collectedEntities as ExtractedEntities),
          };
        }

        // Still need more info
        return {
          type: "question",
          content: `Got it — ${location.city || location.state}!\n\nWhat type of ${context.currentIntent === "OPEN_RESTAURANT" ? "restaurant" : "business"} are you planning?`,
        };
      }

      // Maybe they're answering business type
      const businessType = extractBusinessType(userText);
      if (businessType) {
        context.collectedEntities.businessType = businessType;
        context.stage = "confirming_intent";

        return {
          type: "message",
          content: generateConfirmation(context.currentIntent!, context.collectedEntities as ExtractedEntities),
        };
      }
    }

    return {
      type: "clarification",
      content: `I'm not quite sure what you're looking for. Could you rephrase that?\n\nHere are some things I can help with:\n• Starting a restaurant or food business\n• Registering a new business\n• Applying for identity documents (Aadhaar, PAN, Passport, Voter ID, Driving License)\n• Property registration\n• Birth/marriage certificates\n• Income/caste certificates\n\nJust describe what you need in your own words!`,
    };
  }
}

// ─── Helper ────────────────────────────────────────────────────

function tokenizeSimple(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// ─── Mock services reference (to avoid circular imports) ───────

const MOCK_SERVICES_FOR_AI = [
  { code: "business_registration", name: "Business Registration", department: { name: "Ministry of Corporate Affairs" }, description: "Register your business entity", requiredDocuments: ["Identity proof", "Address proof", "Business plan"], requiredFields: ["Name", "Email", "Phone", "Address", "Business name", "Business type"], estimatedDays: 7 },
  { code: "tax_registration", name: "GST Registration", department: { name: "Income Tax Department" }, description: "Register for GST", requiredDocuments: ["PAN card", "Aadhaar", "Business registration"], requiredFields: ["PAN number", "Business name", "Address"], estimatedDays: 5 },
  { code: "food_license", name: "FSSAI Food License", department: { name: "FSSAI" }, description: "Obtain food safety license", requiredDocuments: ["Business registration", "PAN card", "Layout plan", "Health certificates"], requiredFields: ["Name", "PAN", "Business name", "Address", "Food category"], estimatedDays: 21 },
  { code: "municipal_permission", name: "Municipal Trade License", department: { name: "Municipal Corporation" }, description: "Obtain municipal permission", requiredDocuments: ["Business registration", "Property document", "NOC", "Building plan"], requiredFields: ["Name", "Address", "Business name"], estimatedDays: 14 },
  { code: "fire_safety", name: "Fire Safety NOC", department: { name: "Fire Department" }, description: "Obtain fire safety NOC", requiredDocuments: ["Building plan", "Fire safety measures", "Emergency exit plan"], requiredFields: ["Name", "Address", "Building type"], estimatedDays: 10 },
  { code: "shop_establishment", name: "Shop & Establishment Registration", department: { name: "Labour Department" }, description: "Register under Shops Act", requiredDocuments: ["Business registration", "Identity proof", "Premises proof"], requiredFields: ["Name", "Address", "Business name"], estimatedDays: 7 },
  { code: "passport", name: "Passport Application", department: { name: "Passport Seva (MEA)" }, description: "Apply for passport", requiredDocuments: ["Aadhaar", "PAN", "Address proof", "Birth certificate"], requiredFields: ["Name", "Father's name", "Mother's name", "DOB", "Address"], estimatedDays: 14 },
  { code: "driving_license", name: "Driving License", department: { name: "Ministry of Road Transport" }, description: "Apply for driving license", requiredDocuments: ["Aadhaar", "Address proof", "Age proof", "Medical certificate"], requiredFields: ["Name", "DOB", "Address", "Vehicle class"], estimatedDays: 10 },
  { code: "aadhaar_update", name: "Aadhaar Update", department: { name: "UIDAI" }, description: "Update Aadhaar details", requiredDocuments: ["Existing Aadhaar", "Identity proof", "Address proof"], requiredFields: ["Name", "Aadhaar number", "Address", "Mobile"], estimatedDays: 15 },
  { code: "pan_card", name: "PAN Card Application", department: { name: "Income Tax (NSDL)" }, description: "Apply for PAN card", requiredDocuments: ["Identity proof", "Address proof", "Photograph"], requiredFields: ["Name", "Father's name", "DOB", "Address"], estimatedDays: 7 },
  { code: "voter_id", name: "Voter ID Registration", department: { name: "Election Commission" }, description: "Register as voter", requiredDocuments: ["Aadhaar", "Address proof", "Photograph"], requiredFields: ["Name", "Father's name", "DOB", "Gender", "Address"], estimatedDays: 15 },
  { code: "property_registration", name: "Property Registration", department: { name: "Sub-Registrar Office" }, description: "Register property sale deed", requiredDocuments: ["Sale deed", "Property tax receipt", "NOC", "ID proof"], requiredFields: ["Buyer name", "Seller name", "Property address", "Sale value"], estimatedDays: 3 },
  { code: "birth_certificate", name: "Birth Certificate", department: { name: "Municipal Corporation" }, description: "Obtain birth certificate", requiredDocuments: ["Hospital record", "Parents ID"], requiredFields: ["Child name", "DOB", "Place of birth", "Parents names"], estimatedDays: 7 },
  { code: "marriage_registration", name: "Marriage Registration", department: { name: "Municipal Corporation" }, description: "Register marriage", requiredDocuments: ["Both partners ID", "Photographs", "Witness ID"], requiredFields: ["Groom name", "Bride name", "Marriage date", "Venue"], estimatedDays: 7 },
  { code: "income_certificate", name: "Income Certificate", department: { name: "Revenue Department" }, description: "Obtain income certificate", requiredDocuments: ["Aadhaar", "Salary slip", "Bank statement"], requiredFields: ["Name", "Address", "Annual income", "Occupation"], estimatedDays: 7 },
];
