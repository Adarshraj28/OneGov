// ─── OneGov AI Engine — Enhanced Mock Provider V2 ────────────
// Comprehensive AI that handles every citizen question with government official tone

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
import {
  COMPREHENSIVE_KNOWLEDGE,
  FAQ_RESPONSES,
  OFFICIAL_TEMPLATES,
  type KnowledgeEntry,
} from "./knowledge-base";

// ─── Intent Classification ───────────────────────────────────

interface IntentPattern {
  intent: IntentCategory | string;
  patterns: RegExp[];
  keywords: string[];
  weight: number;
}

const INTENT_PATTERNS: IntentPattern[] = [
  // Restaurant / Food
  {
    intent: "OPEN_RESTAURANT",
    patterns: [
      /open(?:ing)?\s+(?:a\s+)?(?:new\s+)?restaurant/i,
      /start(?:ing)?\s+(?:a\s+)?(?:new\s+)?restaurant/i,
      /restaurant\s+(?:business|setup|open|start)/i,
      /cafe|eatery|dhaba|food\s+truck|cloud\s+kitchen|bakery/i,
    ],
    keywords: ["restaurant", "cafe", "eatery", "dining", "food business", "food stall", "cloud kitchen", "food truck", "canteen", "mess", "bakery", "sweet shop"],
    weight: 1.0,
  },
  // Business
  {
    intent: "START_BUSINESS",
    patterns: [
      /(?:open|start|begin|launch)\s+(?:a\s+)?(?:new\s+)?(?:\w+\s+)?(?:business|startup|venture|shop|store|firm|enterprise|company)/i,
      /business\s+(?:registration|setup|incorporation)/i,
      /register\s+(?:my\s+)?(?:new\s+)?business/i,
      /(?:want|plan|looking)\s+to\s+(?:start|open)\s+(?:a\s+)?business/i,
    ],
    keywords: ["business", "startup", "company", "firm", "enterprise", "shop", "store", "trade", "venture", "pvt ltd", "llp", "partnership", "sole proprietorship"],
    weight: 0.8,
  },
  // Identity documents
  {
    intent: "GET_PASSPORT",
    patterns: [/(?:apply|get|obtain|renew)\s+(?:for\s+)?(?:a\s+)?passport/i, /passport/i],
    keywords: ["passport", "travel document", "passport seva", "international travel", "tatkal passport", "passport renewal"],
    weight: 0.9,
  },
  {
    intent: "GET_DRIVING_LICENSE",
    patterns: [/(?:apply|get|obtain|renew)\s+(?:for\s+)?(?:a\s+)?(?:driving\s+license|dl)/i, /driving\s+license/i],
    keywords: ["driving license", "dl", "learner license", "permanent license", "parivahan", "vehicle license"],
    weight: 0.9,
  },
  {
    intent: "UPDATE_AADHAAR",
    patterns: [/(?:update|correct|change|get|apply)\s+(?:my\s+)?aadhaar/i, /aadhaar/i],
    keywords: ["aadhaar", "aadhaar card", "uidai", "aadhaar update", "aadhaar enrollment"],
    weight: 0.9,
  },
  {
    intent: "GET_PAN_CARD",
    patterns: [/(?:apply|get|obtain|correct)\s+(?:for\s+)?(?:a\s+)?pan/i, /pan\s*(?:card|number)/i],
    keywords: ["pan", "pan card", "pan number", "nsdl", "utiitsl", "permanent account number"],
    weight: 0.9,
  },
  {
    intent: "REGISTER_VOTER_ID",
    patterns: [/(?:apply|get|register|update)\s+(?:for\s+)?(?:a\s+)?voter/i, /voter/i],
    keywords: ["voter", "voter id", "voter card", "election", "electoral", "nvsp", "voting"],
    weight: 0.9,
  },
  // Property
  {
    intent: "PROPERTY_REGISTRATION",
    patterns: [/(?:register|buy|sell|purchase)\s+(?:a\s+)?property/i, /property\s+(?:registration|transfer|sale)/i],
    keywords: ["property", "registration", "sale deed", "land", "house", "flat", "real estate", "sub registrar", "stamp duty"],
    weight: 0.85,
  },
  // Civil
  {
    intent: "BIRTH_CERTIFICATE",
    patterns: [/(?:apply|get|obtain|register)\s+(?:for\s+)?(?:a\s+)?birth\s+certificate/i, /birth\s+(?:certificate|registration)/i],
    keywords: ["birth certificate", "birth registration", "janam praman patra"],
    weight: 0.9,
  },
  {
    intent: "MARRIAGE_REGISTRATION",
    patterns: [/(?:register|get)\s+(?:my\s+)?marriage/i, /marriage\s+(?:registration|certificate)/i],
    keywords: ["marriage", "marriage registration", "wedding", "marriage certificate"],
    weight: 0.9,
  },
  {
    intent: "INCOME_CERTIFICATE",
    patterns: [/(?:apply|get|obtain)\s+(?:for\s+)?(?:an?\s+)?income\s+certificate/i, /income\s+(?:certificate|proof)/i],
    keywords: ["income certificate", "income proof", "salary certificate"],
    weight: 0.85,
  },
  {
    intent: "CASTE_CERTIFICATE",
    patterns: [/(?:apply|get|obtain)\s+(?:for\s+)?(?:a\s+)?caste\s+certificate/i, /caste\s+(?:certificate|proof)/i],
    keywords: ["caste certificate", "caste proof", "sc st obc certificate", "ews certificate"],
    weight: 0.85,
  },
  {
    intent: "RATION_CARD",
    patterns: [/(?:apply|get|obtain)\s+(?:for\s+)?(?:a\s+)?ration\s+card/i, /ration\s+card/i],
    keywords: ["ration card", "ration", "food card", "bpl card"],
    weight: 0.85,
  },
  // Schemes
  {
    intent: "GOVERNMENT_SCHEME",
    patterns: [
      /(?:what|tell|show|list)\s+(?:are\s+)?(?:the\s+)?(?:govt|government|pm|modi)\s+(?:schemes?|yojana|programme)/i,
      /(?:any\s+)?(?:government|govt)\s+(?:scheme|yojana|subsidy|benefit)/i,
      /pm\s+\w+\s+yojana/i,
      /yojana|scheme|subsidy|benefit|welfare/i,
    ],
    keywords: ["scheme", "yojana", "subsidy", "welfare", "benefit", "government scheme", "pm yojana", "pm kisan", "ayushman", "ujjwala", "mudra"],
    weight: 0.7,
  },
  // RTI & Rights
  {
    intent: "RTI_INFO",
    patterns: [
      /(?:how|what)\s+(?:to\s+)?(?:file|apply)\s+(?:an?\s+)?rti/i,
      /rti\s+(?:act|application|filing|online)/i,
      /right\s+to\s+information/i,
    ],
    keywords: ["rti", "right to information", "rti act", "rti application", "transparency"],
    weight: 0.9,
  },
  // Grievance
  {
    intent: "FILE_GRIEVANCE",
    patterns: [
      /(?:how|want|need)\s+(?:to\s+)?(?:file|register|submit)\s+(?:a\s+)?(?:complaint|grievance)/i,
      /(?:file|register)\s+(?:a\s+)?complaint/i,
      /cpgrams|pgportal|grievance\s+portal/i,
    ],
    keywords: ["grievance", "complaint", "cpgrams", "pgportal", "shikayat", "file complaint", "consumer complaint"],
    weight: 0.9,
  },
  // GST & Tax
  {
    intent: "GST_INFO",
    patterns: [
      /(?:how|what)\s+(?:to\s+)?(?:file|register|pay)\s+(?:for\s+)?gst/i,
      /gst\s+(?:filing|registration|return|payment)/i,
    ],
    keywords: ["gst", "goods and services tax", "gst return", "gst filing", "gst registration", "gst payment"],
    weight: 0.9,
  },
  // General help
  {
    intent: "GENERAL_HELP",
    patterns: [
      /^help$/i,
      /^what can you do/i,
      /^how does (?:this|onegov) work/i,
      /^(?:hi|hello|hey|namaste|good morning|good afternoon|good evening)$/i,
    ],
    keywords: ["help", "assist", "guide", "support"],
    weight: 0.5,
  },
];

// ─── Entity Extraction ───────────────────────────────────────

const INDIAN_CITIES: Record<string, string> = {
  pune: "maharashtra", mumbai: "maharashtra", nagpur: "maharashtra",
  nashik: "maharashtra", thane: "maharashtra",
  bangalore: "karnataka", mysore: "karnataka",
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
  indore: "madhya pradesh", bhopal: "madhya pradesh",
};

const BUSINESS_TYPES = [
  "restaurant", "cafe", "bakery", "food stall", "food truck", "cloud kitchen",
  "catering", "sweet shop", "dhaba", "clothing store", "retail shop", "grocery store",
  "electronics store", "pharmacy", "hardware store", "consulting firm", "IT company",
  "digital agency", "manufacturing unit", "trading company", "import export",
  "gym", "fitness center", "salon", "spa", "coaching center", "training institute",
];

function extractLocation(text: string) {
  const lower = text.toLowerCase();
  let city: string | null = null;
  let state: string | null = null;
  for (const [cityName, stateName] of Object.entries(INDIAN_CITIES)) {
    if (lower.includes(cityName)) {
      city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      state = stateName.charAt(0).toUpperCase() + stateName.slice(1);
      break;
    }
  }
  return { state, city };
}

function extractBusinessType(text: string): string | null {
  const lower = text.toLowerCase();
  for (const type of BUSINESS_TYPES) {
    if (lower.includes(type)) return type;
  }
  return null;
}

function classifyIntent(text: string): { intent: string; confidence: number } {
  const lower = text.toLowerCase();
  let bestMatch = { intent: "GENERAL_INQUIRY", confidence: 0 };    for (const pattern of INTENT_PATTERNS) {
    let regexHits = 0;
    let keywordHits = 0;
    for (const regex of pattern.patterns) {
      if (regex.test(text)) regexHits++;
    }
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) keywordHits++;
    }
    if (regexHits * 3 + keywordHits === 0) continue;
    let confidence: number;
    if (regexHits > 0) {
      confidence = Math.min(0.6 + keywordHits * 0.08, 0.98) * pattern.weight;
    } else {
      confidence = Math.min(keywordHits * 0.18, 0.75) * pattern.weight;
    }
    if (confidence > bestMatch.confidence && confidence > 0.15) {
      bestMatch = { intent: pattern.intent as string, confidence };
    }
  }
  return bestMatch;
}

// ─── Knowledge Retrieval ─────────────────────────────────────

function findRelevantKnowledge(query: string): KnowledgeEntry[] {
  const lower = query.toLowerCase();
  const results: { entry: KnowledgeEntry; score: number }[] = [];

  for (const entry of COMPREHENSIVE_KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += 3;
    }
    if (lower.includes(entry.name.toLowerCase())) score += 5;
    if (entry.nameHindi && lower.includes(entry.nameHindi)) score += 5;
    if (score > 0) results.push({ entry, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 3).map((r: { entry: KnowledgeEntry; score: number }) => r.entry);
}

function findFAQ(query: string): string | null {
  const lower = query.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key) || key.split(" ").every((w) => lower.includes(w))) {
      return answer;
    }
  }
  return null;
}

// ─── Response Generators ─────────────────────────────────────

function generateGreeting(): string {
  return OFFICIAL_TEMPLATES.greeting;
}

function generateSchemeResponse(query: string): string {
  const entries = findRelevantKnowledge(query);
  if (entries.length > 0) {
    const e = entries[0];
    let response = `## ${e.name}`;
    if (e.nameHindi) response += ` (${e.nameHindi})`;
    response += `\n**Department:** ${e.department}\n\n${e.description}\n`;
    if (e.eligibility) response += `\n**Eligibility:**\n${e.eligibility.map((x) => `• ${x}`).join("\n")}`;
    if (e.benefits) response += `\n\n**Benefits:**\n${e.benefits.map((x) => `• ${x}`).join("\n")}`;
    if (e.requiredDocuments) response += `\n\n**Documents Required:**\n${e.requiredDocuments.map((x) => `• ${x}`).join("\n")}`;
    if (e.officialPortal) response += `\n\n**Official Portal:** ${e.officialPortal}`;
    if (e.helpline) response += `\n**Helpline:** ${e.helpline}`;
    if (e.fee) response += `\n**Fee:** ${e.fee}`;
    response += OFFICIAL_TEMPLATES.disclaimer;
    return response;
  }
  return `I can provide information about various government schemes. Could you tell me which specific scheme you're interested in?\n\nSome popular schemes include:\n• **PM-KISAN** — Income support for farmers\n• **Ayushman Bharat** — Health insurance\n• **MUDRA Loan** — Business loans up to ₹10 lakh\n• **Ujjwala Yojana** — Free LPG connections\n• **Jan Dhan Yojana** — Zero-balance bank accounts\n• **PM Awas Yojana** — Affordable housing`;
}

function generateRTIResponse(): string {
  return `## Right to Information (RTI) Act, 2005\n\nThe RTI Act empowers every Indian citizen to request information from any public authority.\n\n**How to File RTI:**\n1. Visit **rtionline.gov.in**\n2. Register with your details\n3. Select the public authority (ministry/department)\n4. Write your question clearly and specifically\n5. Pay ₹10 fee (online or court fee stamp)\n6. Submit and note the registration number\n\n**Important Points:**\n• Government must respond within **30 days**\n• If denied, you can file **First Appeal** within 30 days\n• **Second Appeal** to Central/State Information Commission\n• Fee: ₹10 for application, ₹2 per page for information\n\n**Information cannot be denied for:**\n• Life and liberty of person\n• Corruption allegations\n• Human rights violations\n\n**Helpline:** 1800-11-0031\n**Portal:** https://rtionline.gov.in\n\n*RTI is your constitutional right. Use it for transparency and accountability.*` + OFFICIAL_TEMPLATES.disclaimer;
}

function generateGrievanceResponse(): string {
  return `## Filing a Public Grievance (CPGRAMS)\n\n**Centralized Public Grievance Redress and Monitoring System**\n\n**Steps to File:**\n1. Visit **pgportal.gov.in**\n2. Click 'Register Grievance'\n3. Select the ministry/department\n4. Provide:\n   • Your details\n   • Grievance description (be specific)\n   • Supporting documents\n5. Submit and note the **registration number**\n\n**Tracking:**\n• Login to pgportal.gov.in\n• Enter registration number\n• View status and department response\n\n**Timeline:**\n• Department must respond within **30 days**\n• If unsatisfied, file **First Appeal**\n• **Second Appeal** to Ministerial Committee\n\n**Other Options:**\n• **Consumer Forum** — For product/service complaints\n• **Lokpal** — Against corruption\n• **National Human Rights Commission** — For rights violations\n\n**Helpline:** 1800-11-0031\n\n*Your grievance is your right. Every complaint is tracked and must be resolved.*` + OFFICIAL_TEMPLATES.disclaimer;
}

function generateGSTResponse(): string {
  return `## GST — Goods and Services Tax\n\n**Registration:**\n1. Visit **gst.gov.in**\n2. Click 'Services' → 'Registration'\n3. Fill Part A (PAN, mobile, email)\n4. Verify OTP\n5. Fill Part B (business details, documents)\n6. Submit\n7. ARN generated, processing in 3-7 days\n\n**Returns to File:**\n• **GSTR-1** — Outward supplies (by 11th of next month)\n• **GSTR-3B** — Summary return (by 20th of next month)\n• **GSTR-9** — Annual return (by 31st December)\n\n**QRMP Scheme (Small Businesses):**\n• Turnover up to ₹1.5 crore\n• Quarterly filing available\n• Fixed tax amount option\n\n**Late Fees:**\n• GSTR-3B: ₹50/day (CGST + SGST)\n• GSTR-1: ₹25/day (CGST + SGST)\n\n**Helpline:** 1800-103-4786\n**Portal:** https://www.gst.gov.in` + OFFICIAL_TEMPLATES.disclaimer;
}

function generateServiceResponse(entry: KnowledgeEntry): string {
  let response = `## ${entry.name}`;
  if (entry.nameHindi) response += ` (${entry.nameHindi})`;
  response += `\n**Department:** ${entry.department}\n\n${entry.description}\n`;
  if (entry.eligibility) response += `\n**Eligibility:**\n${entry.eligibility.map((x) => `• ${x}`).join("\n")}`;
  if (entry.benefits) response += `\n\n**Benefits:**\n${entry.benefits.map((x) => `• ${x}`).join("\n")}`;
  if (entry.requiredDocuments) response += `\n\n**Documents Required:**\n${entry.requiredDocuments.map((x) => `• ${x}`).join("\n")}`;
  if (entry.prerequisites && entry.prerequisites.length > 0) response += `\n\n**Prerequisites:**\n${entry.prerequisites.map((x) => `• ${x}`).join("\n")}`;
  if (entry.estimatedDays) response += `\n\n**Estimated Time:** ${entry.estimatedDays} working days`;
  if (entry.officialPortal) response += `\n**Official Portal:** ${entry.officialPortal}`;
  if (entry.helpline) response += `\n**Helpline:** ${entry.helpline}`;
  if (entry.fee) response += `\n**Fee:** ${entry.fee}`;
  response += OFFICIAL_TEMPLATES.disclaimer;
  return response;
}

// ─── Enhanced Mock AI Provider ───────────────────────────────

export class MockAIProviderV2 implements AIProvider {
  private rag = getRAGRetriever();

  async generateResponse(context: ConversationContext): Promise<AIResponse> {
    const lastUserMessage = [...context.messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) {
      return { type: "message", content: generateGreeting() };
    }

    const userText = lastUserMessage.content;
    const lower = userText.toLowerCase().trim();

    // ── Greetings ──
    if (/^(hi|hello|hey|namaste|good morning|good afternoon|good evening|hola|howdy|नमस्ते)/i.test(lower)) {
      if (context.stage === "greeting" && context.messages.length <= 2) {
        return { type: "message", content: generateGreeting() };
      }
      return { type: "message", content: `Namaskar! 🙏 How may I assist you today?\n\nTell me what you'd like to accomplish — I can help with government services, schemes, documents, RTI, grievances, and more.` };
    }

    // ── Confirmations ──
    if (/\b(yes|yeah|yep|correct|right|sure|ok|okay|proceed|go ahead|looks good|that's right|confirm|continue|lets go|let's go)\b/i.test(lower)) {
      return this.handleConfirmation(context);
    }

    // ── Denials ──
    if (/\b(no|nah|nope|wrong|incorrect|cancel|back|change|restart|reset)\b/i.test(lower)) {
      context.stage = "greeting";
      context.collectedEntities = { location: { state: null, city: null }, businessType: null, businessStructure: null, serviceType: null };
      context.currentIntent = null;
      return { type: "message", content: "No problem! Let's start fresh. What would you like to accomplish? You can describe it naturally — for example:\n\n• \"I want to open a restaurant in Pune\"\n• \"I need a passport\"\n• \"How do I file RTI?\"\n• \"Tell me about PM-KISAN scheme\"" };
    }

    // ── FAQ matching ──
    const faqAnswer = findFAQ(lower);
    if (faqAnswer) {
      return { type: "message", content: faqAnswer };
    }

    // ── RTI / Rights / Grievance (high priority) ──
    if (/(?:rti|right to information|file.*rti|how.*rti)/i.test(lower)) {
      return { type: "message", content: generateRTIResponse() };
    }
    if (/(?:complaint|grievance|cpgrams|pgportal|file.*complaint|shikayat)/i.test(lower)) {
      return { type: "message", content: generateGrievanceResponse() };
    }
    if (/(?:gst.*(?:filing|register|return|pay)|how.*gst)/i.test(lower)) {
      return { type: "message", content: generateGSTResponse() };
    }

    // ── Scheme queries ──
    if (/(?:scheme|yojana|subsidy|benefit|welfare|pm\s+\w+|ayushman|ujjwala|mudra|pm kisan|jan dhan|atal pension|pm awas|swachh|scholarship)/i.test(lower)) {
      return { type: "message", content: generateSchemeResponse(userText) };
    }

    // ── Knowledge base search ──
    const knowledgeResults = findRelevantKnowledge(userText);
    if (knowledgeResults.length > 0) {
      return { type: "message", content: generateServiceResponse(knowledgeResults[0]) };
    }

    // ── Document questions ──
    if (/(?:what|which|tell|show).*(?:document|require|need|prerequisite)/i.test(lower)) {
      return this.handleDocumentQuestion(userText, context);
    }

    // ── Status / tracking ──
    if (/(?:status|track|where.*application|check.*status)/i.test(lower)) {
      return { type: "message", content: "To check the status of your application:\n\n1. Go to **My Services** in the navigation\n2. Select the journey you want to track\n3. View the real-time status of each step\n\nFor official portal status:\n• **Aadhaar:** uidai.gov.in → Check Aadhaar Status\n• **PAN:** nsdl.com → Track PAN Status\n• **Passport:** passportindia.gov.in → Track Application\n• **DL:** parivahan.gov.in → Application Status\n\nYou can also track using the **Track Application** page with your reference ID (no login required)." };
    }

    // ── Document queries ──
    if (/(?:what documents|document required|documents needed|docs needed)/i.test(lower)) {
      const allDocs = new Set<string>();
      for (const entry of COMPREHENSIVE_KNOWLEDGE) {
        if (entry.requiredDocuments) {
          for (const kw of entry.keywords) {
            if (lower.includes(kw)) {
              entry.requiredDocuments.forEach((d) => allDocs.add(d));
            }
          }
        }
      }
      if (allDocs.size > 0) {
        return { type: "message", content: `Here are the commonly required documents:\n\n${Array.from(allDocs).map((d) => `• ${d}`).join("\n")}\n\nPlease tell me which specific service you need, and I'll provide the exact document list.` };
      }
    }

    // ── Intent classification for services ──
    const { intent, confidence } = classifyIntent(userText);

    if (confidence >= 0.3) {
      const location = extractLocation(userText);
      const businessType = extractBusinessType(userText);

      if (context.stage === "greeting" || context.stage === "collecting_info") {
        const needsLocation = ["OPEN_RESTAURANT", "START_BUSINESS", "PROPERTY_REGISTRATION"].includes(intent);
        const needsBusinessType = intent === "START_BUSINESS";

        if (needsLocation && !location.state) {
          context.currentIntent = intent as unknown as IntentCategory;
          context.collectedEntities = { ...context.collectedEntities, intent: intent as unknown as IntentCategory, location: context.collectedEntities.location || { state: null, city: null }, businessType: context.collectedEntities.businessType || null, businessStructure: context.collectedEntities.businessStructure || null, serviceType: null };
          context.stage = "collecting_info";
          return { type: "question", content: `I can help you with ${intent.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}.\n\nWhich city and state will this be in? For example: "Pune, Maharashtra" or "Bangalore, Karnataka".` };
        }

        if (needsBusinessType && !businessType) {
          context.currentIntent = intent as unknown as IntentCategory;
          context.collectedEntities = { ...context.collectedEntities, intent: intent as unknown as IntentCategory, location: location.state ? location : context.collectedEntities.location, businessType: null, businessStructure: context.collectedEntities.businessStructure || null, serviceType: null };
          context.stage = "collecting_info";
          return { type: "question", content: "What type of business are you planning to start?\n\nFor example: restaurant, cafe, clothing store, consulting firm, grocery store, etc." };
        }

        // We have enough info
        context.currentIntent = intent as unknown as IntentCategory;
        context.collectedEntities = { ...context.collectedEntities, intent: intent as unknown as IntentCategory, location: location.state ? location : context.collectedEntities.location, businessType: businessType || context.collectedEntities.businessType, businessStructure: context.collectedEntities.businessStructure || null, serviceType: null };
        context.stage = "confirming_intent";

        let details = `I understand you want to **${intent.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}**.\n\n`;
        if (location.city) details += `• City: ${location.city}\n`;
        if (location.state) details += `• State: ${location.state}\n`;
        if (businessType) details += `• Type: ${businessType}\n`;
        details += `\nIs this correct? I'll build your complete government-service roadmap.`;
        return { type: "message", content: details };
      }
    }

    // ── Unclear intent — provide helpful guidance ──
    if (context.currentIntent && context.stage === "collecting_info") {
      // Try to extract location from unclear input
      const location = extractLocation(userText);
      if (location.state || location.city) {
        context.collectedEntities.location = location;
        context.stage = "confirming_intent";
        return { type: "message", content: `Got it — ${location.city || location.state}! I'll include that in your roadmap.\n\nIs this correct? Say "yes" to proceed or tell me if you'd like to change anything.` };
      }
    }

    // ── Default: comprehensive help response ──
    return {
      type: "message",
      content: `I'm here to help you with government services, schemes, documents, and procedures.\n\n**Here's what I can assist with:**\n\n📋 **Identity Documents** — Aadhaar, PAN, Passport, Voter ID, Driving License\n🏢 **Business** — Registration, GST, FSSAI License, MSME\n📄 **Certificates** — Birth, Death, Marriage, Income, Caste\n🏠 **Property** — Registration, Land Records\n🌾 **Schemes** — PM-KISAN, Ayushman Bharat, MUDRA, Ujjwala, and more\n⚖️ **Rights** — RTI filing, Consumer Protection, Labour Rights\n📢 **Grievance** — CPGRAMS complaint filing\n\nJust describe what you need in your own words, and I'll guide you through the process.\n\n**Examples:**\n• "I want to open a restaurant in Pune"\n• "How do I file RTI?"\n• "Tell me about PM-KISAN scheme"\n• "I need a passport"\n• "How to check property records?"`,
    };
  }

  async extractIntent(userMessage: string, context?: ConversationContext): Promise<ExtractedEntities> {
    const { intent, confidence } = classifyIntent(userMessage);
    const location = extractLocation(userMessage);
    const businessType = extractBusinessType(userMessage);
    return {
      intent: intent as unknown as IntentCategory,
      confidence,
      location,
      businessType,
      businessStructure: null,
      serviceType: null,
      keywords: userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
      missingCriticalInfo: [],
    };
  }

  async generateWorkflow(intent: IntentCategory, entities: ExtractedEntities): Promise<WorkflowData> {
    const serviceCodeMap: Record<string, string[]> = {
      OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
      OPEN_FOOD_BUSINESS: ["business_registration", "tax_registration", "food_license", "municipal_permission"],
      START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
      REGISTER_COMPANY: ["business_registration", "tax_registration"],
      GET_PASSPORT: ["passport"],
      GET_DRIVING_LICENSE: ["driving_license"],
      UPDATE_AADHAAR: ["aadhaar_update"],
      GET_PAN_CARD: ["pan_card"],
      REGISTER_VOTER_ID: ["voter_id"],
      PROPERTY_REGISTRATION: ["property_registration", "municipal_permission"],
      BIRTH_CERTIFICATE: ["birth_certificate"],
      MARRIAGE_REGISTRATION: ["marriage_registration"],
      INCOME_CERTIFICATE: ["income_certificate"],
      CASTE_CERTIFICATE: ["caste_certificate"],
      RATION_CARD: ["ration_card"],
    };
    const serviceCodes = serviceCodeMap[intent] || ["business_registration"];
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

    return {
      id: `workflow-${Date.now()}`,
      title: intent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `Complete government-service workflow`,
      location: locationStr,
      totalSteps: steps.length,
      estimatedDays: steps.reduce((sum, s) => sum + s.estimatedDays, 0),
      steps,
    };
  }

  async processToolCall(toolCall: ToolCall, context: ConversationContext): Promise<ToolResult> {
    return executeToolCall(toolCall, context);
  }

  private handleConfirmation(context: ConversationContext): AIResponse {
    if (context.stage === "confirming_intent" && context.currentIntent) {
      const entities: ExtractedEntities = {
        intent: context.currentIntent as IntentCategory,
        confidence: 0.9,
        location: context.collectedEntities.location || { state: null, city: null },
        businessType: context.collectedEntities.businessType || null,
        businessStructure: context.collectedEntities.businessStructure || null,
        serviceType: null,
        keywords: [],
        missingCriticalInfo: [],
      };
      const serviceCodeMap: Record<string, string[]> = {
        OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
        START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
        GET_PASSPORT: ["passport"],
        GET_DRIVING_LICENSE: ["driving_license"],
        UPDATE_AADHAAR: ["aadhaar_update"],
        GET_PAN_CARD: ["pan_card"],
        REGISTER_VOTER_ID: ["voter_id"],
        PROPERTY_REGISTRATION: ["property_registration", "municipal_permission"],
        BIRTH_CERTIFICATE: ["birth_certificate"],
        MARRIAGE_REGISTRATION: ["marriage_registration"],
        INCOME_CERTIFICATE: ["income_certificate"],
        CASTE_CERTIFICATE: ["caste_certificate"],
        RATION_CARD: ["ration_card"],
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

      let content = `## ${workflow.title}\n\nYour personalized government-service roadmap for **${workflow.title.toLowerCase()}** in **${workflow.location}**.\n\n**Total Steps:** ${workflow.totalSteps} • **Estimated Time:** ~${workflow.estimatedDays} days\n\n### Roadmap\n\n`;
      for (const step of workflow.steps) {
        const icon = step.status === "ready" ? "🔵" : "🔒";
        const deps = step.dependencies.length > 0 ? ` (depends on: ${step.dependencies.join(", ")})` : "";
        content += `${icon} **Step ${step.sequence}: ${step.title}**\n   ${step.department}\n   Est. ${step.estimatedDays} days${deps}\n\n`;
      }
      content += `Each step is actionable — you can start working through them one by one.\nI'll guide you through requirements, documents, and submissions as you go.`;

      return {
        type: "workflow",
        content,
        metadata: {          intent: context.currentIntent as unknown as IntentCategory, entities: context.collectedEntities, workflow },
      };
    }

    if (context.stage === "workflow_generated") {
      return {
        type: "message",
        content: `Your workflow is ready! Click **"Start Your Journey"** on the workflow card above to begin.\n\nEach step will guide you through the required documents, information, and submission process.\n\nWould you like me to walk you through any specific step?`,
      };
    }

    return { type: "message", content: "I'm ready to help! What would you like to accomplish?" };
  }

  private handleDocumentQuestion(userText: string, context: ConversationContext): AIResponse {
    if (context.stage === "workflow_generated" && context.currentIntent) {
      const allDocs = new Set<string>();
      const serviceCodeMap: Record<string, string[]> = {
        OPEN_RESTAURANT: ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety"],
        START_BUSINESS: ["business_registration", "tax_registration", "municipal_permission"],
      };
      const codes = serviceCodeMap[context.currentIntent] || [];
      for (const code of codes) {
        const doc = this.rag.getService(code);
        if (doc) doc.requiredDocuments.forEach((d) => allDocs.add(d));
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
      content: "Could you tell me which specific service you need documents for? For example:\n• \"What documents do I need for passport?\"\n• \"Documents for business registration\"\n• \"What papers for property purchase?\"",
    };
  }
}
