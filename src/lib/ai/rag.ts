// ─── OneGov AI Engine — RAG System ─────────────────────────────
// Retrieval Augmented Generation for government service knowledge
// Uses TF-IDF-like scoring for semantic retrieval without external dependencies

import type { ServiceDocument, RetrievalResult } from "./types";

// ─── Service Knowledge Base ────────────────────────────────────
// This is the verified source of truth for all government services.
// The AI retrieves from this before generating any response.

export const SERVICE_KNOWLEDGE_BASE: ServiceDocument[] = [
  {
    id: "kb-001",
    serviceCode: "business_registration",
    name: "Business Registration",
    department: "Ministry of Corporate Affairs (MCA)",
    description:
      "Register your business entity (Private Limited, LLP, Partnership, Sole Proprietorship) with the Ministry of Corporate Affairs.",
    category: "business",
    keywords: [
      "business", "company", "register", "startup", "enterprise", "firm",
      "private limited", "llp", "partnership", "sole proprietorship", "mca",
      "incorporation", "business entity", "new business", "start business",
      "open business", "register company", "business registration",
    ],
    requiredDocuments: [
      "Identity proof (Aadhaar/PAN)",
      "Address proof",
      "Business plan or memorandum",
      "Partners/directors ID proof",
      "Office address proof",
    ],
    requiredFields: [
      "Applicant name",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "PIN code",
      "Business name",
      "Business type/structure",
    ],
    eligibility: [
      "Indian citizen or entity",
      "Valid identity proof",
      "Registered business address in India",
    ],
    prerequisites: [
      "PAN card for all directors/partners",
      "Digital Signature Certificate (DSC)",
    ],
    estimatedDays: 7,
    officialPortal: "https://www.mca.gov.in",
  },
  {
    id: "kb-002",
    serviceCode: "tax_registration",
    name: "GST Registration",
    department: "Income Tax Department / GSTN",
    description:
      "Register for Goods and Services Tax (GST) to legally collect tax on sales and claim input tax credits.",
    category: "tax",
    keywords: [
      "gst", "tax", "goods and services tax", "tax registration", "gstn",
      "tax number", "gst number", "input tax", "tax filing", "business tax",
    ],
    requiredDocuments: [
      "PAN card",
      "Aadhaar card",
      "Business registration certificate",
      "Address proof of business",
      "Bank account details",
      "Photograph of applicant",
    ],
    requiredFields: [
      "PAN number",
      "Business name",
      "Business address",
      "City",
      "State",
      "Business type",
      "Annual turnover",
    ],
    eligibility: [
      "Business with annual turnover above ₹40 lakh (₹20 lakh for special category states)",
      "Previously registered under any pre-GST law",
      "Inter-state supplier of goods/services",
    ],
    prerequisites: [
      "Completed business registration",
      "PAN card",
    ],
    estimatedDays: 5,
    officialPortal: "https://www.gst.gov.in",
  },
  {
    id: "kb-003",
    serviceCode: "food_license",
    name: "FSSAI Food License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    description:
      "Obtain food safety license required for any food business including restaurants, cafes, food stalls, and cloud kitchens.",
    category: "food",
    keywords: [
      "food", "fssai", "restaurant", "cafe", "food license", "food business",
      "food safety", "dining", "eatery", "food stall", "cloud kitchen",
      "catering", "food shop", "bakery", "hotel food", "street food",
    ],
    requiredDocuments: [
      "Business registration certificate",
      "PAN card",
      "Layout plan of premises",
      "Health and safety certificates",
      "List of food products to be sold",
      "Water test report",
      "MSME/SSI certificate (if applicable)",
    ],
    requiredFields: [
      "Applicant name",
      "PAN number",
      "Business name",
      "Business address",
      "City",
      "State",
      "Business type",
      "Food category",
    ],
    eligibility: [
      "Any food business operator in India",
      "Annual turnover above ₹12 lakh requires state license",
      "Annual turnover above ₹20 crore requires central license",
    ],
    prerequisites: [
      "Completed business registration",
      "PAN card",
      "Physical premises for inspection",
    ],
    estimatedDays: 21,
    officialPortal: "https://www.fssai.gov.in",
  },
  {
    id: "kb-004",
    serviceCode: "municipal_permission",
    name: "Municipal Trade License",
    department: "Municipal Corporation",
    description:
      "Obtain trade license/permission from local Municipal Corporation for commercial establishment operations.",
    category: "municipal",
    keywords: [
      "municipal", "trade license", "commercial", "permission", "shop",
      "establishment", "local authority", "corporation", "nagarpalika",
      "business permission", "commercial license",
    ],
    requiredDocuments: [
      "Business registration certificate",
      "Property document or rent agreement",
      "NOC from neighbors",
      "Building plan approval",
      "Fire safety NOC",
      "Pollution control certificate",
    ],
    requiredFields: [
      "Applicant name",
      "Business address",
      "City",
      "State",
      "PIN code",
      "Business name",
      "Business type",
    ],
    eligibility: [
      "Any commercial establishment within municipal limits",
      "Property with valid building permissions",
    ],
    prerequisites: [
      "Completed business registration",
      "Property ownership/lease documents",
    ],
    estimatedDays: 14,
    officialPortal: null,
  },
  {
    id: "kb-005",
    serviceCode: "fire_safety",
    name: "Fire Safety NOC",
    department: "Fire Department",
    description:
      "Obtain No Objection Certificate from Fire Department for fire safety compliance of commercial premises.",
    category: "safety",
    keywords: [
      "fire", "fire safety", "noc", "fire department", "fire clearance",
      "fire extinguisher", "fire exit", "fire compliance", "safety certificate",
    ],
    requiredDocuments: [
      "Building plan with fire safety measures",
      "Fire safety equipment details",
      "Emergency evacuation plan",
      "Building completion certificate",
      "Electrical safety certificate",
    ],
    requiredFields: [
      "Applicant name",
      "Premises address",
      "City",
      "State",
      "Building type",
      "Business name",
      "Business type",
    ],
    eligibility: [
      "Commercial buildings above 15 meters height",
      "Public assembly buildings",
      "Buildings with basement parking",
      "High-rise residential buildings",
    ],
    prerequisites: [
      "Completed municipal permission",
      "Building plan approval",
    ],
    estimatedDays: 10,
    officialPortal: null,
  },
  {
    id: "kb-006",
    serviceCode: "shop_establishment",
    name: "Shop & Establishment Registration",
    department: "Labour Department / Municipal Corporation",
    description:
      "Register under the Shops and Establishments Act for operating a commercial establishment.",
    category: "municipal",
    keywords: [
      "shop", "establishment", "labour", "shops act", "commercial registration",
      "employee registration", "workplace",
    ],
    requiredDocuments: [
      "Business registration certificate",
      "Identity proof of owner",
      "Premises proof (ownership/rent)",
      "Details of employees",
    ],
    requiredFields: [
      "Owner name",
      "Business address",
      "City",
      "State",
      "Business name",
      "Number of employees",
      "Nature of business",
    ],
    eligibility: [
      "Any commercial establishment employing workers",
    ],
    prerequisites: [
      "Completed business registration",
    ],
    estimatedDays: 7,
    officialPortal: null,
  },
  {
    id: "kb-007",
    serviceCode: "aadhaar_update",
    name: "Aadhaar Card Update",
    department: "Unique Identification Authority of India (UIDAI)",
    description:
      "Update your Aadhaar card details including address, mobile number, email, and biometrics at any Aadhaar center.",
    category: "identity",
    keywords: [
      "aadhaar", "aadhaar update", "aadhaar card", "uidai", "aadhaar correction",
      "update address aadhaar", "aadhaar mobile update", "aadhaar enrollment",
      "unique id", "identity", "aadhaar number",
    ],
    requiredDocuments: [
      "Existing Aadhaar card",
      "Identity proof for update",
      "Address proof for address change",
    ],
    requiredFields: [
      "Name",
      "Aadhaar number",
      "Address",
      "City",
      "State",
      "PIN code",
      "Mobile number",
      "Date of birth",
    ],
    eligibility: [
      "Any Aadhaar holder",
    ],
    prerequisites: [],
    estimatedDays: 15,
    officialPortal: "https://www.uidai.gov.in",
  },
  {
    id: "kb-008",
    serviceCode: "pan_card",
    name: "PAN Card Application",
    department: "Income Tax Department (via NSDL/UTIITSL)",
    description:
      "Apply for a new PAN card or make corrections/changes through NSDL or UTIITSL.",
    category: "identity",
    keywords: [
      "pan", "pan card", "pan number", "nsdl", "utiitsl", "income tax",
      "permanent account number", "pan application", "pan correction",
    ],
    requiredDocuments: [
      "Identity proof (Aadhaar/Voter ID/Passport)",
      "Address proof",
      "Passport-size photograph",
      "Date of birth proof",
    ],
    requiredFields: [
      "Full name",
      "Father's name",
      "Date of birth",
      "Address",
      "City",
      "State",
      "PIN code",
      "Mobile number",
      "Email",
    ],
    eligibility: [
      "Indian citizen",
      "Indian company or entity",
      "Any person who pays income tax",
    ],
    prerequisites: [],
    estimatedDays: 7,
    officialPortal: "https://www.onlineservices.nsdl.com",
  },
  {
    id: "kb-009",
    serviceCode: "passport",
    name: "Passport Application",
    department: "Passport Seva, Ministry of External Affairs",
    description:
      "Apply for a new passport, renewal, or reissue through Passport Seva Kendra.",
    category: "identity",
    keywords: [
      "passport", "passport application", "passport renewal", "passport seva",
      "travel document", "international travel", "new passport", "reissue passport",
      "passport police verification",
    ],
    requiredDocuments: [
      "Aadhaar card",
      "PAN card",
      "Address proof",
      "Photograph (passport size)",
      "Birth certificate or age proof",
      "Old passport (for renewal)",
    ],
    requiredFields: [
      "Full name",
      "Father's name",
      "Mother's name",
      "Date of birth",
      "Address",
      "City",
      "State",
      "PIN code",
      "Mobile number",
      "Email",
      "Passport type (Ordinary/Official/Diplomatic)",
    ],
    eligibility: [
      "Indian citizen",
      "Minor applicants need parent consent",
    ],
    prerequisites: [
      "Aadhaar card (recommended)",
      "PAN card (recommended)",
    ],
    estimatedDays: 14,
    officialPortal: "https://www.passportindia.gov.in",
  },
  {
    id: "kb-010",
    serviceCode: "driving_license",
    name: "Driving License",
    department: "Ministry of Road Transport & Highways (Parivahan)",
    description:
      "Apply for a learner's or permanent driving license through Parivahan Sewa.",
    category: "transport",
    keywords: [
      "driving license", "dl", "learner license", "permanent license",
      "parivahan", "vehicle", "driving", "transport", "car license",
      "bike license", "motor driving",
    ],
    requiredDocuments: [
      "Aadhaar card",
      "Address proof",
      "Age proof (birth certificate/school certificate)",
      "Medical certificate (Form 1A)",
      "Passport-size photographs",
      "Learner's license (for permanent DL)",
    ],
    requiredFields: [
      "Full name",
      "Date of birth",
      "Address",
      "City",
      "State",
      "PIN code",
      "Vehicle class",
      "Mobile number",
    ],
    eligibility: [
      "Age 18+ for transport vehicles",
      "Age 16+ for non-transport vehicles (with parent consent)",
      "Medically fit",
    ],
    prerequisites: [
      "Valid learner's license (for permanent DL)",
    ],
    estimatedDays: 10,
    officialPortal: "https://parivahan.gov.in",
  },
  {
    id: "kb-011",
    serviceCode: "voter_id",
    name: "Voter ID Registration",
    department: "Election Commission of India (ECI)",
    description:
      "Register as a voter or update your Voter ID details through the National Voters' Service Portal.",
    category: "identity",
    keywords: [
      "voter", "voter id", "election", "voting", "electoral", "nvsp",
      "voter registration", "voter card", "election commission",
    ],
    requiredDocuments: [
      "Aadhaar card",
      "Address proof",
      "Photograph",
      "Age proof",
    ],
    requiredFields: [
      "Full name",
      "Father's name",
      "Date of birth",
      "Gender",
      "Address",
      "City",
      "State",
      "PIN code",
      "Mobile number",
    ],
    eligibility: [
      "Indian citizen",
      "Age 18 or above on January 1 of the year",
      "Ordinary resident of the constituency",
    ],
    prerequisites: [],
    estimatedDays: 15,
    officialPortal: "https://www.nvsp.in",
  },
  {
    id: "kb-012",
    serviceCode: "property_registration",
    name: "Property Registration",
    department: "Sub-Registrar Office / Revenue Department",
    description:
      "Register property sale deed at the Sub-Registrar Office for legal ownership transfer.",
    category: "property",
    keywords: [
      "property", "registration", "sale deed", "land", "house", "flat",
      "real estate", "sub registrar", "stamp duty", "property transfer",
      "buy property", "property purchase",
    ],
    requiredDocuments: [
      "Sale deed (original)",
      "Property tax receipts",
      "NOC from relevant authorities",
      "Identity proof of both parties",
      "Stamp duty payment receipt",
      "Encumbrance certificate",
      "Mother deed / chain of documents",
    ],
    requiredFields: [
      "Buyer name",
      "Seller name",
      "Property address",
      "Property area",
      "Sale value",
      "City",
      "State",
    ],
    eligibility: [
      "Legal owner/seller of property",
      "Valid sale agreement",
    ],
    prerequisites: [
      "Stamp duty payment",
      "Valuation certificate",
    ],
    estimatedDays: 3,
    officialPortal: null,
  },
  {
    id: "kb-013",
    serviceCode: "birth_certificate",
    name: "Birth Certificate",
    department: "Municipal Corporation",
    description:
      "Register birth and obtain birth certificate from the local Municipal Corporation.",
    category: "civil",
    keywords: [
      "birth certificate", "birth registration", "janam praman patra",
      "child birth", "newborn", "birth record",
    ],
    requiredDocuments: [
      "Hospital birth record",
      "Parents' identity proof",
      "Parents' marriage certificate",
    ],
    requiredFields: [
      "Child's name",
      "Date of birth",
      "Place of birth",
      "Father's name",
      "Mother's name",
      "Address",
      "City",
    ],
    eligibility: [
      "Parents of newborn child",
      "Within 21 days of birth (normal registration)",
    ],
    prerequisites: [],
    estimatedDays: 7,
    officialPortal: null,
  },
  {
    id: "kb-014",
    serviceCode: "marriage_registration",
    name: "Marriage Registration",
    department: "Municipal Corporation / Sub-Registrar",
    description:
      "Register marriage under the Special Marriage Act or Hindu Marriage Act.",
    category: "civil",
    keywords: [
      "marriage", "marriage registration", "wedding", "shadi",
      "vivah", "marriage certificate", "registered marriage",
    ],
    requiredDocuments: [
      "Both partners' identity proof",
      "Address proof",
      "Photographs of both partners",
      "Witness identity proof (2 witnesses)",
      "Marriage invitation or photograph",
      "Affidavit of marriage",
    ],
    requiredFields: [
      "Groom name",
      "Bride name",
      "Marriage date",
      "Marriage venue",
      "Address",
      "City",
      "Witness 1 name",
      "Witness 2 name",
    ],
    eligibility: [
      "Groom age 21+, Bride age 18+",
      "Both parties consenting",
    ],
    prerequisites: [],
    estimatedDays: 7,
    officialPortal: null,
  },
  {
    id: "kb-015",
    serviceCode: "income_certificate",
    name: "Income Certificate",
    department: "Revenue Department / Tehsildar Office",
    description:
      "Obtain income certificate for government schemes, subsidies, and educational purposes.",
    category: "civil",
    keywords: [
      "income certificate", "income proof", "salary certificate",
      "income verification", "government scheme", "subsidy",
    ],
    requiredDocuments: [
      "Aadhaar card",
      "Salary slips or income proof",
      "Bank statement",
      "Affidavit",
    ],
    requiredFields: [
      "Full name",
      "Father's name",
      "Address",
      "City",
      "State",
      "Annual income",
      "Occupation",
      "Purpose",
    ],
    eligibility: [
      "Any Indian citizen",
    ],
    prerequisites: [],
    estimatedDays: 7,
    officialPortal: null,
  },
];

// ─── Tokenization & Scoring ────────────────────────────────────

/**
 * Tokenize text into lowercase words, removing stop words
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves",
    "you", "your", "yours", "yourself", "yourselves",
    "he", "him", "his", "himself", "she", "her", "hers", "herself",
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
    "what", "which", "who", "whom", "this", "that", "these", "those",
    "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "having", "do", "does", "did", "doing",
    "a", "an", "the", "and", "but", "if", "or", "because", "as",
    "until", "while", "of", "at", "by", "for", "with", "about",
    "against", "between", "through", "during", "before", "after",
    "above", "below", "to", "from", "up", "down", "in", "out",
    "on", "off", "over", "under", "again", "further", "then", "once",
    "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too",
    "very", "s", "t", "can", "will", "just", "don", "should", "now",
    "want", "need", "like", "going", "get", "got", "also", "would",
    "could", "please", "help", "start", "open", "apply",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

/**
 * Calculate TF-IDF-like relevance score between query and document
 */
function calculateRelevance(queryTokens: string[], document: ServiceDocument): number {
  const docText = [
    document.name,
    document.description,
    document.department,
    document.category,
    ...document.keywords,
    ...document.requiredDocuments,
  ]
    .join(" ")
    .toLowerCase();

  const docTokens = new Set(tokenize(docText));

  let score = 0;

  for (const queryToken of queryTokens) {
    // Exact keyword match (highest weight)
    if (document.keywords.some((k) => k.includes(queryToken))) {
      score += 3;
    }

    // Token match in document
    if (docTokens.has(queryToken)) {
      score += 2;
    }

    // Partial match in document
    for (const docToken of docTokens) {
      if (docToken.includes(queryToken) || queryToken.includes(docToken)) {
        score += 1;
        break;
      }
    }
  }

  // Bonus for category match
  if (queryTokens.some((t) => document.category.includes(t))) {
    score += 2;
  }

  // Normalize by query length
  return queryTokens.length > 0 ? score / queryTokens.length : 0;
}

// ─── RAG Retriever ─────────────────────────────────────────────

export class RAGRetriever {
  private knowledgeBase: ServiceDocument[];

  constructor() {
    this.knowledgeBase = SERVICE_KNOWLEDGE_BASE;
  }

  /**
   * Retrieve the most relevant services for a user query
   */
  retrieve(query: string, topK = 5): RetrievalResult[] {
    const queryTokens = tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    const results: RetrievalResult[] = this.knowledgeBase.map((doc) => ({
      document: doc,
      score: calculateRelevance(queryTokens, doc),
    }));

    return results
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Retrieve a specific service by code
   */
  getService(serviceCode: string): ServiceDocument | undefined {
    return this.knowledgeBase.find((doc) => doc.serviceCode === serviceCode);
  }

  /**
   * Get all services in a category
   */
  getServicesByCategory(category: string): ServiceDocument[] {
    return this.knowledgeBase.filter((doc) => doc.category === category);
  }

  /**
   * Search by keywords (for entity extraction support)
   */
  searchByKeywords(keywords: string[]): ServiceDocument[] {
    const scored = this.knowledgeBase.map((doc) => {
      const matchCount = keywords.filter((kw) =>
        doc.keywords.some((dk) => dk.includes(kw) || kw.includes(dk))
      ).length;
      return { doc, matchCount };
    });

    return scored
      .filter((s) => s.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((s) => s.doc);
  }

  /**
   * Get the full knowledge base (for context injection)
   */
  getFullKnowledgeBase(): ServiceDocument[] {
    return this.knowledgeBase;
  }
}

// Singleton
let retrieverInstance: RAGRetriever | null = null;

export function getRAGRetriever(): RAGRetriever {
  if (!retrieverInstance) {
    retrieverInstance = new RAGRetriever();
  }
  return retrieverInstance;
}
