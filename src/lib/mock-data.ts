// ─── Mock Data for Demo (No Database Required) ─────────────────

export const MOCK_USERS: Record<string, { id: string; name: string; email: string; role: string; phone: string; passwordHash: string; profile?: Record<string, string | null> }> = {
  "adarsh@citizen.gov": {
    id: "citizen-001",
    name: "Adarsh Raj",
    email: "adarsh@citizen.gov",
    role: "citizen",
    phone: "9876543210",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
    profile: {
      address: "42, MG Road, Near Deccan Gymkhana",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      dateOfBirth: "1992-07-14",
      gender: "Male",
      aadhaarNumber: "4521 7890 3456",
      panNumber: "AXPRR4521M",
      gstNumber: "27AXPRR4521M1ZQ",
      voterId: "MXR1234567",
      passportNumber: "R1234567",
      drivingLicense: "MH1220230004567",
      fatherName: "Suresh Raj",
      motherName: "Sunita Raj",
      email: "adarsh.raj@gmail.com",
      annualIncome: "₹8,50,000",
      occupation: "Business Owner",
      businessName: "Adarsh Food Hub Pvt. Ltd.",
      businessType: "private_limited",
      businessRegDate: "2024-03-15",
      cinNumber: "U56100MH2024PTC123456",
    },
  },
  "priya@citizen.gov": {
    id: "citizen-002",
    name: "Priya Sharma",
    email: "priya@citizen.gov",
    role: "citizen",
    phone: "9876543211",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
    profile: {
      address: "15, Linking Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      dateOfBirth: "1988-05-20",
      gender: "Female",
      aadhaarNumber: "8934 5612 7890",
      panNumber: "BTPPS7890K",
      gstNumber: "27BTPPS7890K1ZQ",
      voterId: "MXR9876543",
      passportNumber: "R7654321",
      drivingLicense: "MH0120220007890",
      fatherName: "Rajesh Sharma",
      motherName: "Meena Sharma",
      email: "priya.sharma@outlook.com",
      annualIncome: "₹12,00,000",
      occupation: "Business Owner",
      businessName: "Sharma Trading Corporation",
      businessType: "partnership",
      businessRegDate: "2022-11-08",
      cinNumber: null,
    },
  },
  "rajesh@officer.gov": {
    id: "officer-001",
    name: "Dr. Rajesh Kulkarni",
    email: "rajesh@officer.gov",
    role: "officer",
    phone: "9876500001",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
    profile: { department: "Municipal Corporation of Pune", designation: "Deputy Commissioner", employeeId: "MCP-2024-0891" },
  },
  "admin@onegov.gov": {
    id: "admin-001",
    name: "System Administrator",
    email: "admin@onegov.gov",
    role: "admin",
    phone: "9876500000",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
    profile: { department: "National Informatics Centre", designation: "System Administrator", employeeId: "NIC-2024-0001" },
  },
};

export const MOCK_DEPARTMENTS = [
  { id: "dept-1", name: "Ministry of Corporate Affairs", code: "MCA", icon: "building", color: "#1e40af" },
  { id: "dept-2", name: "Municipal Corporation", code: "MUNICIPAL", icon: "landmark", color: "#0369a1" },
  { id: "dept-3", name: "Food Safety (FSSAI)", code: "FSSAI", icon: "utensils", color: "#15803d" },
  { id: "dept-4", name: "Fire Department", code: "FIRE", icon: "flame", color: "#dc2626" },
  { id: "dept-5", name: "Income Tax Department", code: "ITD", icon: "receipt", color: "#7c3aed" },
  { id: "dept-6", name: "Unique Identification Authority (UIDAI)", code: "UIDAI", icon: "fingerprint", color: "#0369a1" },
  { id: "dept-7", name: "Passport Seva (MEA)", code: "PASSPORT", icon: "book-open", color: "#1e40af" },
  { id: "dept-8", name: "Ministry of Road Transport", code: "MORTH", icon: "car", color: "#ea580c" },
  { id: "dept-9", name: "Election Commission of India", code: "ECI", icon: "vote", color: "#16a34a" },
  { id: "dept-10", name: "National Informatics Centre", code: "NIC", icon: "monitor", color: "#2563eb" },
];

export const MOCK_SERVICES = [
  // Business & Tax Services
  { id: "svc-1", name: "Business Registration", code: "business_registration", departmentId: "dept-1", department: MOCK_DEPARTMENTS[0], description: "Register your business entity with the Ministry of Corporate Affairs", category: "business", adapterType: "BusinessRegistrationAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["identity_proof", "address_proof", "business_plan"], requiredFields: ["name", "email", "phone", "address", "city", "state", "pincode", "panNumber", "businessName", "businessType"] },
  { id: "svc-2", name: "Tax Registration (GST)", code: "tax_registration", departmentId: "dept-5", department: MOCK_DEPARTMENTS[4], description: "Register for Goods and Services Tax", category: "tax", adapterType: "TaxAdapter", estimatedDays: 5, slaDays: 10, status: "active", requiredDocuments: ["pan_card", "address_proof", "business_registration"], requiredFields: ["name", "panNumber", "address", "city", "state", "pincode", "businessName", "businessType"] },
  { id: "svc-3", name: "Food License (FSSAI)", code: "food_license", departmentId: "dept-3", department: MOCK_DEPARTMENTS[2], description: "Obtain food safety license from FSSAI", category: "food", adapterType: "FoodLicenseAdapter", estimatedDays: 21, slaDays: 30, status: "active", requiredDocuments: ["business_registration", "pan_card", "floor_plan", "health_certificates"], requiredFields: ["name", "panNumber", "businessName", "address", "city", "state", "businessType"] },
  { id: "svc-4", name: "Municipal Permission", code: "municipal_permission", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Obtain municipal corporation permission for commercial establishment", category: "municipal", adapterType: "MunicipalAdapter", estimatedDays: 14, slaDays: 21, status: "active", requiredDocuments: ["business_registration", "property_document", "noc", "fire_safety"], requiredFields: ["name", "address", "city", "state", "pincode", "businessName", "businessType"] },
  { id: "svc-5", name: "Fire Safety NOC", code: "fire_safety", departmentId: "dept-4", department: MOCK_DEPARTMENTS[3], description: "Obtain fire safety No Objection Certificate", category: "safety", adapterType: "FireSafetyAdapter", estimatedDays: 10, slaDays: 14, status: "active", requiredDocuments: ["building_plan", "fire_safety_measures", "emergency_exit_plan"], requiredFields: ["name", "address", "city", "state", "businessName", "businessType"] },
  { id: "svc-6", name: "Shop & Establishment License", code: "shop_establishment", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Register under Shops and Establishments Act", category: "municipal", adapterType: "MunicipalAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["business_registration", "identity_proof", "premises_proof"], requiredFields: ["name", "address", "city", "state", "businessName", "businessType"] },
  { id: "svc-7", name: "Final Compliance Approval", code: "final_approval", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Final compliance and approval certificate", category: "general", adapterType: "MunicipalAdapter", estimatedDays: 5, slaDays: 10, status: "active", requiredDocuments: ["all_previous_approvals"], requiredFields: ["name", "businessName", "address"] },
  // Official Government Identity Services
  { id: "svc-8", name: "Aadhaar Card Update", code: "aadhaar_update", departmentId: "dept-6", department: MOCK_DEPARTMENTS[5], description: "Update your Aadhaar card details (address, mobile, biometrics)", category: "identity", adapterType: "UIDAIAdapter", estimatedDays: 15, slaDays: 30, status: "active", requiredDocuments: ["identity_proof", "address_proof", "existing_aadhaar"], requiredFields: ["name", "aadhaarNumber", "address", "city", "state", "pincode", "mobile", "dateOfBirth"] },
  { id: "svc-9", name: "New Aadhaar Enrollment", code: "aadhaar_enrollment", departmentId: "dept-6", department: MOCK_DEPARTMENTS[5], description: "Apply for new Aadhaar card enrollment", category: "identity", adapterType: "UIDAIAdapter", estimatedDays: 30, slaDays: 60, status: "active", requiredDocuments: ["identity_proof", "address_proof", "date_of_birth_proof"], requiredFields: ["name", "address", "city", "state", "pincode", "mobile", "dateOfBirth", "gender"] },
  { id: "svc-10", name: "PAN Card Application", code: "pan_card", departmentId: "dept-5", department: MOCK_DEPARTMENTS[4], description: "Apply for new PAN card or corrections via NSDL/UTIITSL", category: "identity", adapterType: "PANAdapter", estimatedDays: 7, slaDays: 15, status: "active", requiredDocuments: ["identity_proof", "address_proof", "photograph"], requiredFields: ["name", "fatherName", "dateOfBirth", "address", "city", "state", "pincode", "mobile", "email"] },
  { id: "svc-11", name: "Passport Application", code: "passport", departmentId: "dept-7", department: MOCK_DEPARTMENTS[6], description: "Apply for new passport or renewal via Passport Seva", category: "identity", adapterType: "PassportAdapter", estimatedDays: 14, slaDays: 30, status: "active", requiredDocuments: ["aadhaar", "pan_card", "address_proof", "photograph", "birth_certificate"], requiredFields: ["name", "fatherName", "motherName", "dateOfBirth", "address", "city", "state", "pincode", "mobile", "email", "passportType"] },
  { id: "svc-12", name: "Driving License", code: "driving_license", departmentId: "dept-8", department: MOCK_DEPARTMENTS[7], description: "Apply for learner's or permanent driving license via Parivahan", category: "transport", adapterType: "TransportAdapter", estimatedDays: 10, slaDays: 21, status: "active", requiredDocuments: ["aadhaar", "address_proof", "age_proof", "medical_certificate", "photograph"], requiredFields: ["name", "dateOfBirth", "address", "city", "state", "pincode", "vehicleClass", "mobile"] },
  { id: "svc-13", name: "Voter ID Registration", code: "voter_id", departmentId: "dept-9", department: MOCK_DEPARTMENTS[8], description: "Register as a voter or update details via NVSP", category: "identity", adapterType: "VoterAdapter", estimatedDays: 15, slaDays: 30, status: "active", requiredDocuments: ["aadhaar", "address_proof", "photograph", "age_proof"], requiredFields: ["name", "fatherName", "dateOfBirth", "gender", "address", "city", "state", "pincode", "mobile"] },
  { id: "svc-14", name: "Birth Certificate", code: "birth_certificate", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Apply for birth certificate from Municipal Corporation", category: "civil", adapterType: "MunicipalAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["hospital_record", "parents_id_proof", "parents_marriage_cert"], requiredFields: ["childName", "dateOfBirth", "placeOfBirth", "fatherName", "motherName", "address", "city"] },
  { id: "svc-15", name: "Death Certificate", code: "death_certificate", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Register death and obtain death certificate", category: "civil", adapterType: "MunicipalAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["hospital_record", "applicant_id_proof"], requiredFields: ["deceasedName", "dateOfDeath", "placeOfDeath", "applicantName", "relation", "address", "city"] },
  { id: "svc-16", name: "Marriage Registration", code: "marriage_registration", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Register marriage under Special Marriage Act or Hindu Marriage Act", category: "civil", adapterType: "MunicipalAdapter", estimatedDays: 7, slaDays: 15, status: "active", requiredDocuments: ["both_partners_id", "address_proof", "photographs", "witness_id", "marriage_invitation"], requiredFields: ["groomName", "brideName", "marriageDate", "marriagePlace", "address", "city", "witness1Name", "witness2Name"] },
  { id: "svc-17", name: "Income Certificate", code: "income_certificate", departmentId: "dept-5", department: MOCK_DEPARTMENTS[4], description: "Obtain income certificate for government schemes and subsidies", category: "civil", adapterType: "RevenueAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["aadhaar", "salary_slip", "bank_statement", "affidavit"], requiredFields: ["name", "fatherName", "address", "city", "state", "annualIncome", "occupation", "purpose"] },
  { id: "svc-18", name: "Caste Certificate", code: "caste_certificate", departmentId: "dept-5", department: MOCK_DEPARTMENTS[4], description: "Obtain caste certificate for reservation benefits", category: "civil", adapterType: "RevenueAdapter", estimatedDays: 10, slaDays: 21, status: "active", requiredDocuments: ["aadhaar", "school_leaving", "parent_caste_cert", "affidavit"], requiredFields: ["name", "fatherName", "dateOfBirth", "address", "city", "state", "caste", "subCaste"] },
  { id: "svc-19", name: "Ration Card Application", code: "ration_card", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Apply for new ration card or add family members", category: "welfare", adapterType: "MunicipalAdapter", estimatedDays: 15, slaDays: 30, status: "active", requiredDocuments: ["aadhaar", "address_proof", "income_certificate", "family_photo"], requiredFields: ["headOfFamily", "familyMembers", "address", "city", "state", "annualIncome"] },
  { id: "svc-20", name: "Property Registration", code: "property_registration", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Register property sale deed at Sub-Registrar Office", category: "property", adapterType: "MunicipalAdapter", estimatedDays: 3, slaDays: 7, status: "active", requiredDocuments: ["sale_deed", "property_tax_receipt", "noc", "id_proof_both_parties", "stamp_duty"], requiredFields: ["buyerName", "sellerName", "propertyAddress", "propertyArea", "saleValue", "city", "state"] },
  { id: "svc-21", name: "Land Records (7/12 Extract)", code: "land_records", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "View and obtain 7/12 extract and property card from Maharashtra", category: "property", adapterType: "MunicipalAdapter", estimatedDays: 1, slaDays: 3, status: "active", requiredDocuments: ["property_details"], requiredFields: ["surveyNumber", "village", "taluka", "district"] },
];

const MOCK_JOURNEYS_BASE = [
  { id: "journey-001", intent: "I want to open a restaurant in Pune", status: "completed", progress: 100, createdAt: "2026-08-10T10:00:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-002", intent: "I want to start a business in Mumbai", status: "in_progress", progress: 45, createdAt: "2026-08-15T14:30:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
  { id: "journey-003", intent: "I need to register a property in Nagpur", status: "in_progress", progress: 65, createdAt: "2026-08-18T09:15:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-004", intent: "I want to apply for a passport and driving license", status: "created", progress: 10, createdAt: "2026-08-22T11:00:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
  { id: "journey-005", intent: "I want to open a food stall in Pune", status: "completed", progress: 100, createdAt: "2026-07-20T08:00:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-006", intent: "I need Aadhaar update and PAN card correction", status: "in_progress", progress: 30, createdAt: "2026-08-20T16:45:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
];

function makeSteps(journeyId: string, serviceCodes: string[], statuses: string[]) {
  return serviceCodes.map((code, i) => {
    const svc = MOCK_SERVICES.find((s) => s.code === code)!;
    return {
      id: `step-${journeyId}-${i + 1}`,
      journeyId,
      serviceId: svc.id,
      service: svc,
      status: statuses[i] || "pending",
      sequence: i + 1,
      externalApplicationId: statuses[i] === "approved" || statuses[i] === "submitted" ? `${code.substring(0, 2).toUpperCase()}-2026-${10000 + Math.floor(Math.random() * 90000)}` : null,
      startedAt: statuses[i] !== "pending" && statuses[i] !== "waiting" ? "2026-08-10T10:00:00Z" : null,
      completedAt: statuses[i] === "approved" ? "2026-08-14T10:00:00Z" : null,
      retryCount: 0,
      maxRetries: 3,
    };
  });
}

export const MOCK_JOURNEYS = [
  { ...MOCK_JOURNEYS_BASE[0], steps: makeSteps("journey-001", ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety", "final_approval"], ["approved", "approved", "approved", "approved", "approved", "approved"]) },
  { ...MOCK_JOURNEYS_BASE[1], steps: makeSteps("journey-002", ["business_registration", "tax_registration", "municipal_permission"], ["approved", "submitted", "in_progress"]) },
  { ...MOCK_JOURNEYS_BASE[2], steps: makeSteps("journey-003", ["property_registration", "municipal_permission", "fire_safety", "final_approval"], ["approved", "approved", "in_progress", "waiting"]) },
  { ...MOCK_JOURNEYS_BASE[3], steps: makeSteps("journey-004", ["passport", "driving_license"], ["pending", "waiting"]) },
  { ...MOCK_JOURNEYS_BASE[4], steps: makeSteps("journey-005", ["business_registration", "food_license", "fire_safety"], ["approved", "approved", "approved"]) },
  { ...MOCK_JOURNEYS_BASE[5], steps: makeSteps("journey-006", ["aadhaar_update", "pan_card"], ["in_progress", "waiting"]) },
];

export const MOCK_NOTIFICATIONS = [
  { id: "notif-1", userId: "citizen-001", type: "status_update", title: "Business Registration - Approved", message: "Your business registration has been approved. Application ID: BR-2026-10291", read: false, createdAt: "2026-08-20T10:00:00Z" },
  { id: "notif-2", userId: "citizen-001", type: "status_update", title: "Food License - Under Review", message: "Your FSSAI application is being reviewed by the department.", read: false, createdAt: "2026-08-21T14:30:00Z" },
  { id: "notif-3", userId: "citizen-001", type: "alert", title: "Service Temporarily Unavailable", message: "Fire Safety service is temporarily offline. Your request will retry automatically.", read: true, createdAt: "2026-08-19T09:00:00Z" },
  { id: "notif-4", userId: "citizen-001", type: "system", title: "Welcome to ONEGOV", message: "Your account has been created successfully. Start your service journey today.", read: true, createdAt: "2026-08-10T08:00:00Z" },
  { id: "notif-5", userId: "citizen-001", type: "reminder", title: "Document Required", message: "Please upload your PAN card for Tax Registration.", read: false, createdAt: "2026-08-22T11:00:00Z" },
  { id: "notif-6", userId: "citizen-002", type: "status_update", title: "Aadhaar Update - Submitted", message: "Your Aadhaar update request has been submitted successfully.", read: false, createdAt: "2026-08-21T16:00:00Z" },
  { id: "notif-7", userId: "citizen-002", type: "reminder", title: "Action Required", message: "Please review and sign the property registration application.", read: false, createdAt: "2026-08-22T09:30:00Z" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "audit-1", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "user.login", resource: "user", resourceId: "citizen-001", metadata: "{}", createdAt: "2026-08-24T08:00:00Z" },
  { id: "audit-2", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "journey.created", resource: "journey", resourceId: "journey-001", metadata: "{}", createdAt: "2026-08-20T10:00:00Z" },
  { id: "audit-3", userId: "citizen-002", user: { name: "Priya Sharma", email: "priya@citizen.gov" }, action: "journey.step.submitted", resource: "journey_step", resourceId: "step-journey-002-2", metadata: "{}", createdAt: "2026-08-21T14:30:00Z" },
  { id: "audit-4", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "consent.granted", resource: "consent", resourceId: "consent-1", metadata: "{}", createdAt: "2026-08-19T11:00:00Z" },
  { id: "audit-5", userId: "citizen-002", user: { name: "Priya Sharma", email: "priya@citizen.gov" }, action: "integration.request", resource: "integration", resourceId: "int-1", metadata: "{}", createdAt: "2026-08-21T15:00:00Z" },
];

export const MOCK_INTEGRATION_HEALTH = [
  { department: "business_registration", displayName: "Business Registration (MCA)", status: "online", latencyMs: 120, totalRequests: 1247, failedRequests: 12, uptimePercent: 99.0 },
  { department: "municipal_permission", displayName: "Municipal Permission", status: "online", latencyMs: 200, totalRequests: 982, failedRequests: 34, uptimePercent: 96.5 },
  { department: "food_license", displayName: "Food License (FSSAI)", status: "online", latencyMs: 150, totalRequests: 756, failedRequests: 18, uptimePercent: 97.6 },
  { department: "fire_safety", displayName: "Fire Safety", status: "online", latencyMs: 180, totalRequests: 423, failedRequests: 8, uptimePercent: 98.1 },
  { department: "tax_registration", displayName: "Tax Registration (GST)", status: "online", latencyMs: 100, totalRequests: 1589, failedRequests: 6, uptimePercent: 99.6 },
  { department: "aadhaar_update", displayName: "Aadhaar (UIDAI)", status: "online", latencyMs: 180, totalRequests: 2150, failedRequests: 15, uptimePercent: 99.3 },
  { department: "pan_card", displayName: "PAN Card (NSDL)", status: "online", latencyMs: 130, totalRequests: 1890, failedRequests: 10, uptimePercent: 99.5 },
  { department: "passport", displayName: "Passport Seva (MEA)", status: "online", latencyMs: 160, totalRequests: 980, failedRequests: 8, uptimePercent: 99.2 },
  { department: "driving_license", displayName: "Driving License (Parivahan)", status: "online", latencyMs: 140, totalRequests: 1560, failedRequests: 20, uptimePercent: 98.7 },
  { department: "voter_id", displayName: "Voter ID (NVSP)", status: "online", latencyMs: 170, totalRequests: 890, failedRequests: 5, uptimePercent: 99.4 },
  { department: "property_registration", displayName: "Property Registration", status: "online", latencyMs: 220, totalRequests: 650, failedRequests: 12, uptimePercent: 98.2 },
  { department: "birth_certificate", displayName: "Birth Certificate", status: "online", latencyMs: 110, totalRequests: 1120, failedRequests: 7, uptimePercent: 99.4 },
];

export const OFFICIAL_GOV_SERVICES = [
  { name: "Aadhaar Card", category: "identity", icon: "Fingerprint", department: "UIDAI", description: "Apply for new Aadhaar or update existing details", color: "blue" },
  { name: "PAN Card", category: "identity", icon: "CreditCard", department: "Income Tax", description: "Apply for PAN card or make corrections", color: "purple" },
  { name: "Passport", category: "identity", icon: "BookOpen", department: "MEA", description: "New passport, renewal, or reissue", color: "blue" },
  { name: "Driving License", category: "transport", icon: "Car", department: "MORTH", description: "Learner's or permanent driving license", color: "orange" },
  { name: "Voter ID", category: "identity", icon: "Vote", department: "ECI", description: "Voter registration or correction", color: "green" },
  { name: "Birth Certificate", category: "civil", icon: "Baby", department: "Municipal", description: "Obtain birth certificate", color: "cyan" },
  { name: "Income Certificate", category: "civil", icon: "IndianRupee", department: "Revenue", description: "Get income certificate for subsidies", color: "emerald" },
  { name: "Property Registration", category: "property", icon: "Home", department: "Sub-Registrar", description: "Register property sale deed", color: "amber" },
  { name: "Ration Card", category: "welfare", icon: "UtensilsCrossed", department: "Food & Civil Supplies", description: "Apply for new ration card", color: "red" },
  { name: "Caste Certificate", category: "civil", icon: "ScrollText", department: "Revenue", description: "Obtain caste certificate", color: "violet" },
];
