// ─── Mock Data for Demo (No Database Required) ─────────────────

export const MOCK_USERS: Record<string, { id: string; name: string; email: string; role: string; phone: string; passwordHash: string; profile?: Record<string, string | null> }> = {
  "adarsh@citizen.gov": {
    id: "citizen-001",
    name: "Adarsh Raj",
    email: "adarsh@citizen.gov",
    role: "citizen",
    phone: "9876543210",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e", // password123
    profile: { address: "123 Main Street", city: "Pune", state: "Maharashtra", pincode: "411001", dateOfBirth: "1990-01-15", panNumber: "ABCDE1234F", businessName: "Adarsh Enterprises", businessType: "sole_proprietorship" },
  },
  "priya@citizen.gov": {
    id: "citizen-002",
    name: "Priya Sharma",
    email: "priya@citizen.gov",
    role: "citizen",
    phone: "9876543211",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
    profile: { address: "456 Park Road", city: "Mumbai", state: "Maharashtra", pincode: "400001", dateOfBirth: "1988-05-20", panNumber: "FGHIJ5678K", businessName: "Priya Trading Co", businessType: "partnership" },
  },
  "rajesh@officer.gov": {
    id: "officer-001",
    name: "Dr. Rajesh Kulkarni",
    email: "rajesh@officer.gov",
    role: "officer",
    phone: "9876500001",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
  },
  "admin@onegov.gov": {
    id: "admin-001",
    name: "System Administrator",
    email: "admin@onegov.gov",
    role: "admin",
    phone: "9876500000",
    passwordHash: "$2a$12$LJ3m4y1q8kV3XqHx1Z5NwOxY3qF2n8rT5vP7sD9gK4mB6cH8jA2e",
  },
};

export const MOCK_DEPARTMENTS = [
  { id: "dept-1", name: "Ministry of Corporate Affairs", code: "MCA", icon: "building", color: "#1e40af" },
  { id: "dept-2", name: "Municipal Corporation", code: "MUNICIPAL", icon: "landmark", color: "#0369a1" },
  { id: "dept-3", name: "Food Safety (FSSAI)", code: "FSSAI", icon: "utensils", color: "#15803d" },
  { id: "dept-4", name: "Fire Department", code: "FIRE", icon: "flame", color: "#dc2626" },
  { id: "dept-5", name: "Income Tax Department", code: "ITD", icon: "receipt", color: "#7c3aed" },
];

export const MOCK_SERVICES = [
  { id: "svc-1", name: "Business Registration", code: "business_registration", departmentId: "dept-1", department: MOCK_DEPARTMENTS[0], description: "Register your business entity with the Ministry of Corporate Affairs", category: "business", adapterType: "BusinessRegistrationAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["identity_proof", "address_proof", "business_plan"], requiredFields: ["name", "email", "phone", "address", "city", "state", "pincode", "panNumber", "businessName", "businessType"] },
  { id: "svc-2", name: "Tax Registration (GST)", code: "tax_registration", departmentId: "dept-5", department: MOCK_DEPARTMENTS[4], description: "Register for Goods and Services Tax", category: "tax", adapterType: "TaxAdapter", estimatedDays: 5, slaDays: 10, status: "active", requiredDocuments: ["pan_card", "address_proof", "business_registration"], requiredFields: ["name", "panNumber", "address", "city", "state", "pincode", "businessName", "businessType"] },
  { id: "svc-3", name: "Food License (FSSAI)", code: "food_license", departmentId: "dept-3", department: MOCK_DEPARTMENTS[2], description: "Obtain food safety license from FSSAI", category: "food", adapterType: "FoodLicenseAdapter", estimatedDays: 21, slaDays: 30, status: "active", requiredDocuments: ["business_registration", "pan_card", "floor_plan", "health_certificates"], requiredFields: ["name", "panNumber", "businessName", "address", "city", "state", "businessType"] },
  { id: "svc-4", name: "Municipal Permission", code: "municipal_permission", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Obtain municipal corporation permission for commercial establishment", category: "municipal", adapterType: "MunicipalAdapter", estimatedDays: 14, slaDays: 21, status: "active", requiredDocuments: ["business_registration", "property_document", "noc", "fire_safety"], requiredFields: ["name", "address", "city", "state", "pincode", "businessName", "businessType"] },
  { id: "svc-5", name: "Fire Safety NOC", code: "fire_safety", departmentId: "dept-4", department: MOCK_DEPARTMENTS[3], description: "Obtain fire safety No Objection Certificate", category: "safety", adapterType: "FireSafetyAdapter", estimatedDays: 10, slaDays: 14, status: "active", requiredDocuments: ["building_plan", "fire_safety_measures", "emergency_exit_plan"], requiredFields: ["name", "address", "city", "state", "businessName", "businessType"] },
  { id: "svc-6", name: "Shop & Establishment License", code: "shop_establishment", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Register under Shops and Establishments Act", category: "municipal", adapterType: "MunicipalAdapter", estimatedDays: 7, slaDays: 14, status: "active", requiredDocuments: ["business_registration", "identity_proof", "premises_proof"], requiredFields: ["name", "address", "city", "state", "businessName", "businessType"] },
  { id: "svc-7", name: "Final Compliance Approval", code: "final_approval", departmentId: "dept-2", department: MOCK_DEPARTMENTS[1], description: "Final compliance and approval certificate", category: "general", adapterType: "MunicipalAdapter", estimatedDays: 5, slaDays: 10, status: "active", requiredDocuments: ["all_previous_approvals"], requiredFields: ["name", "businessName", "address"] },
];

const MOCK_JOURNEYS_BASE = [
  { id: "journey-001", intent: "I want to open a restaurant in Pune", status: "completed", progress: 100, createdAt: "2026-08-10T10:00:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-002", intent: "I want to start a business in Mumbai", status: "in_progress", progress: 45, createdAt: "2026-08-15T14:30:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
  { id: "journey-003", intent: "I need to register a property in Nagpur", status: "in_progress", progress: 65, createdAt: "2026-08-18T09:15:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-004", intent: "I want to apply for a government scheme", status: "created", progress: 10, createdAt: "2026-08-22T11:00:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
  { id: "journey-005", intent: "I want to open a food stall in Pune", status: "completed", progress: 100, createdAt: "2026-07-20T08:00:00Z", userId: "citizen-001", user: { id: "citizen-001", name: "Adarsh Raj", email: "adarsh@citizen.gov" } },
  { id: "journey-006", intent: "I want to start a consulting firm in Mumbai", status: "in_progress", progress: 30, createdAt: "2026-08-20T16:45:00Z", userId: "citizen-002", user: { id: "citizen-002", name: "Priya Sharma", email: "priya@citizen.gov" } },
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
  { ...MOCK_JOURNEYS_BASE[2], steps: makeSteps("journey-003", ["business_registration", "municipal_permission", "fire_safety", "final_approval"], ["approved", "approved", "in_progress", "waiting"]) },
  { ...MOCK_JOURNEYS_BASE[3], steps: makeSteps("journey-004", ["business_registration", "tax_registration"], ["pending", "waiting"]) },
  { ...MOCK_JOURNEYS_BASE[4], steps: makeSteps("journey-005", ["business_registration", "food_license", "fire_safety"], ["approved", "approved", "approved"]) },
  { ...MOCK_JOURNEYS_BASE[5], steps: makeSteps("journey-006", ["business_registration", "tax_registration", "shop_establishment"], ["approved", "in_progress", "waiting"]) },
];

export const MOCK_NOTIFICATIONS = [
  { id: "notif-1", userId: "citizen-001", type: "status_update", title: "Business Registration - Approved", message: "Your business registration has been approved. Application ID: BR-2026-10291", read: false, createdAt: "2026-08-20T10:00:00Z" },
  { id: "notif-2", userId: "citizen-001", type: "status_update", title: "Food License - Under Review", message: "Your FSSAI application is being reviewed by the department.", read: false, createdAt: "2026-08-21T14:30:00Z" },
  { id: "notif-3", userId: "citizen-001", type: "alert", title: "Service Temporarily Unavailable", message: "Fire Safety service is temporarily offline. Your request will retry automatically.", read: true, createdAt: "2026-08-19T09:00:00Z" },
  { id: "notif-4", userId: "citizen-001", type: "system", title: "Welcome to ONEGOV", message: "Your account has been created successfully. Start your service journey today.", read: true, createdAt: "2026-08-10T08:00:00Z" },
  { id: "notif-5", userId: "citizen-001", type: "reminder", title: "Document Required", message: "Please upload your PAN card for Tax Registration.", read: false, createdAt: "2026-08-22T11:00:00Z" },
  { id: "notif-6", userId: "citizen-002", type: "status_update", title: "GST Registration - Submitted", message: "Your GST registration has been submitted successfully.", read: false, createdAt: "2026-08-21T16:00:00Z" },
  { id: "notif-7", userId: "citizen-002", type: "reminder", title: "Action Required", message: "Please review and sign the municipal permission application.", read: false, createdAt: "2026-08-22T09:30:00Z" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "audit-1", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "user.login", resource: "user", resourceId: "citizen-001", metadata: "{}", createdAt: "2026-08-24T08:00:00Z" },
  { id: "audit-2", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "journey.created", resource: "journey", resourceId: "journey-001", metadata: "{}", createdAt: "2026-08-20T10:00:00Z" },
  { id: "audit-3", userId: "citizen-002", user: { name: "Priya Sharma", email: "priya@citizen.gov" }, action: "journey.step.submitted", resource: "journey_step", resourceId: "step-journey-002-2", metadata: "{}", createdAt: "2026-08-21T14:30:00Z" },
  { id: "audit-4", userId: "citizen-001", user: { name: "Adarsh Raj", email: "adarsh@citizen.gov" }, action: "consent.granted", resource: "consent", resourceId: "consent-1", metadata: "{}", createdAt: "2026-08-19T11:00:00Z" },
  { id: "audit-5", userId: "citizen-002", user: { name: "Priya Sharma", email: "priya@citizen.gov" }, action: "integration.request", resource: "integration", resourceId: "int-1", metadata: "{}", createdAt: "2026-08-21T15:00:00Z" },
];

export const MOCK_INTEGRATION_HEALTH = [
  { department: "business_registration", displayName: "Business Registration", status: "online", latencyMs: 120, totalRequests: 1247, failedRequests: 12, uptimePercent: 99.0 },
  { department: "municipal_permission", displayName: "Municipal Permission", status: "online", latencyMs: 200, totalRequests: 982, failedRequests: 34, uptimePercent: 96.5 },
  { department: "food_license", displayName: "Food License", status: "online", latencyMs: 150, totalRequests: 756, failedRequests: 18, uptimePercent: 97.6 },
  { department: "fire_safety", displayName: "Fire Safety", status: "online", latencyMs: 180, totalRequests: 423, failedRequests: 8, uptimePercent: 98.1 },
  { department: "tax_registration", displayName: "Tax Registration", status: "online", latencyMs: 100, totalRequests: 1589, failedRequests: 6, uptimePercent: 99.6 },
];
