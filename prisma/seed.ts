import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log(`  📂 Connecting to: ${process.env.DATABASE_URL}`);
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ONEGOV database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.integrationRequest.deleteMany();
  await prisma.document.deleteMany();
  await prisma.journeyStep.deleteMany();
  await prisma.serviceJourney.deleteMany();
  await prisma.serviceDependency.deleteMany();
  await prisma.service.deleteMany();
  await prisma.department.deleteMany();
  await prisma.citizenProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.integrationHealth.deleteMany();
  await prisma.systemConfig.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // ─── Users ───────────────────────────────────────────────────

  const citizenUsers = await Promise.all(
    [
      { name: "Adarsh Raj", email: "adarsh@citizen.gov", phone: "9876543210", city: "Pune", state: "Maharashtra", pincode: "411001" },
      { name: "Priya Sharma", email: "priya@citizen.gov", phone: "9876543211", city: "Mumbai", state: "Maharashtra", pincode: "400001" },
      { name: "Rohan Deshmukh", email: "rohan@citizen.gov", phone: "9876543212", city: "Nagpur", state: "Maharashtra", pincode: "440001" },
      { name: "Sneha Patil", email: "sneha@citizen.gov", phone: "9876543213", city: "Pune", state: "Maharashtra", pincode: "411002" },
      { name: "Amit Kumar", email: "amit@citizen.gov", phone: "9876543214", city: "Nashik", state: "Maharashtra", pincode: "422001" },
      { name: "Kavita Joshi", email: "kavita@citizen.gov", phone: "9876543215", city: "Mumbai", state: "Maharashtra", pincode: "400002" },
      { name: "Suresh Gupta", email: "suresh@citizen.gov", phone: "9876543216", city: "Aurangabad", state: "Maharashtra", pincode: "431001" },
      { name: "Neha Verma", email: "neha@citizen.gov", phone: "9876543217", city: "Pune", state: "Maharashtra", pincode: "411003" },
      { name: "Vikram Singh", email: "vikram@citizen.gov", phone: "9876543218", city: "Mumbai", state: "Maharashtra", pincode: "400003" },
      { name: "Anjali Kulkarni", email: "anjali@citizen.gov", phone: "9876543219", city: "Nagpur", state: "Maharashtra", pincode: "440002" },
    ].map(async ({ city, state, pincode, ...u }) => {
      const user = await prisma.user.create({
        data: {
          ...u,
          passwordHash,
          role: "citizen",
        },
      });
      await prisma.citizenProfile.create({
        data: {
          userId: user.id,
          address: `123 Main Street`,
          city,
          state,
          pincode,
          dateOfBirth: "1990-01-15",
          panNumber: "ABCDE1234F",
          businessName: `${u.name} Enterprises`,
          businessType: "sole_proprietorship",
        },
      });
      return user;
    })
  );

  const officerUsers = await Promise.all(
    [
      { name: "Dr. Rajesh Kulkarni", email: "rajesh@officer.gov", phone: "9876500001" },
      { name: "Sunita Bhave", email: "sunita@officer.gov", phone: "9876500002" },
      { name: "Manoj Deshpande", email: "manoj@officer.gov", phone: "9876500003" },
    ].map(async (u) =>
      prisma.user.create({
        data: { ...u, passwordHash, role: "officer" },
      })
    )
  );

  const adminUser = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@onegov.gov",
      phone: "9876500000",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`  ✓ Created ${citizenUsers.length} citizens, ${officerUsers.length} officers, 1 admin`);

  // ─── Departments ─────────────────────────────────────────────

  const departments = await Promise.all(
    [
      { name: "Ministry of Corporate Affairs", code: "MCA", icon: "building", color: "#1e40af" },
      { name: "Municipal Corporation", code: "MUNICIPAL", icon: "landmark", color: "#0369a1" },
      { name: "Food Safety (FSSAI)", code: "FSSAI", icon: "utensils", color: "#15803d" },
      { name: "Fire Department", code: "FIRE", icon: "flame", color: "#dc2626" },
      { name: "Income Tax Department", code: "ITD", icon: "receipt", color: "#7c3aed" },
    ].map(async (d) =>
      prisma.department.create({ data: d })
    )
  );

  console.log(`  ✓ Created ${departments.length} departments`);

  // ─── Services ────────────────────────────────────────────────

  const deptMap = Object.fromEntries(departments.map((d) => [d.code, d.id]));

  const services = await Promise.all(
    [
      {
        name: "Business Registration",
        code: "business_registration",
        departmentId: deptMap.MCA,
        description: "Register your business entity with the Ministry of Corporate Affairs",
        category: "business",
        adapterType: "BusinessRegistrationAdapter",
        estimatedDays: 7,
        slaDays: 14,
        requiredDocuments: JSON.stringify(["identity_proof", "address_proof", "business_plan"]),
        requiredFields: JSON.stringify(["name", "email", "phone", "address", "city", "state", "pincode", "panNumber", "businessName", "businessType"]),
      },
      {
        name: "Tax Registration (GST)",
        code: "tax_registration",
        departmentId: deptMap.ITD,
        description: "Register for Goods and Services Tax",
        category: "tax",
        adapterType: "TaxAdapter",
        estimatedDays: 5,
        slaDays: 10,
        requiredDocuments: JSON.stringify(["pan_card", "address_proof", "business_registration"]),
        requiredFields: JSON.stringify(["name", "panNumber", "address", "city", "state", "pincode", "businessName", "businessType"]),
      },
      {
        name: "Food License (FSSAI)",
        code: "food_license",
        departmentId: deptMap.FSSAI,
        description: "Obain food safety license from FSSAI",
        category: "food",
        adapterType: "FoodLicenseAdapter",
        estimatedDays: 21,
        slaDays: 30,
        requiredDocuments: JSON.stringify(["business_registration", "pan_card", "floor_plan", "health_certificates"]),
        requiredFields: JSON.stringify(["name", "panNumber", "businessName", "address", "city", "state", "businessType"]),
      },
      {
        name: "Municipal Permission",
        code: "municipal_permission",
        departmentId: deptMap.MUNICIPAL,
        description: "Obtain municipal corporation permission for commercial establishment",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 14,
        slaDays: 21,
        requiredDocuments: JSON.stringify(["business_registration", "property_document", " noc", "fire_safety"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "pincode", "businessName", "businessType"]),
      },
      {
        name: "Fire Safety NOC",
        code: "fire_safety",
        departmentId: deptMap.FIRE,
        description: "Obtain fire safety No Objection Certificate",
        category: "safety",
        adapterType: "FireSafetyAdapter",
        estimatedDays: 10,
        slaDays: 14,
        requiredDocuments: JSON.stringify(["building_plan", "fire_safety_measures", "emergency_exit_plan"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName", "businessType"]),
      },
      {
        name: "Shop & Establishment License",
        code: "shop_establishment",
        departmentId: deptMap.MUNICIPAL,
        description: "Register under Shops and Establishments Act",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 7,
        slaDays: 14,
        requiredDocuments: JSON.stringify(["business_registration", "identity_proof", "premises_proof"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName", "businessType"]),
      },
      {
        name: "Trade License",
        code: "trade_license",
        departmentId: deptMap.MUNICIPAL,
        description: "Obtain trade license from municipal corporation",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 10,
        slaDays: 14,
        requiredDocuments: JSON.stringify(["business_registration", "property_document"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName"]),
      },
      {
        name: "Pollution Certificate",
        code: "pollution_cert",
        departmentId: deptMap.MUNICIPAL,
        description: "Obtain pollution control certificate",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 14,
        slaDays: 21,
        requiredDocuments: JSON.stringify(["business_registration", "environmental_plan"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName"]),
      },
      {
        name: "Professional Tax Registration",
        code: "professional_tax",
        departmentId: deptMap.ITD,
        description: "Register for professional tax",
        category: "tax",
        adapterType: "TaxAdapter",
        estimatedDays: 3,
        slaDays: 7,
        requiredDocuments: JSON.stringify(["pan_card", "business_registration"]),
        requiredFields: JSON.stringify(["name", "panNumber", "address", "city", "state"]),
      },
      {
        name: "Sign Board Permission",
        code: "signboard_permission",
        departmentId: deptMap.MUNICIPAL,
        description: "Permission for outdoor signage and boards",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 7,
        slaDays: 14,
        requiredDocuments: JSON.stringify(["property_document", "sign_design"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName"]),
      },
      {
        name: "MSME Registration",
        code: "msme_registration",
        departmentId: deptMap.MCA,
        description: "Register as Micro, Small or Medium Enterprise",
        category: "business",
        adapterType: "BusinessRegistrationAdapter",
        estimatedDays: 3,
        slaDays: 7,
        requiredDocuments: JSON.stringify(["business_registration", "pan_card", "bank_details"]),
        requiredFields: JSON.stringify(["name", "panNumber", "businessName", "businessType", "address"]),
      },
      {
        name: "Water Connection Approval",
        code: "water_connection",
        departmentId: deptMap.MUNICIPAL,
        description: "Apply for commercial water connection",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 14,
        slaDays: 21,
        requiredDocuments: JSON.stringify(["property_document", "noc"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName"]),
      },
      {
        name: "Building Plan Approval",
        code: "building_plan",
        departmentId: deptMap.MUNICIPAL,
        description: "Submit building plan for approval",
        category: "municipal",
        adapterType: "MunicipalAdapter",
        estimatedDays: 30,
        slaDays: 45,
        requiredDocuments: JSON.stringify(["architect_plan", "land_documents", "noc"]),
        requiredFields: JSON.stringify(["name", "address", "city", "state"]),
      },
      {
        name: "Health Trade License",
        code: "health_trade_license",
        departmentId: deptMap.FSSAI,
        description: "Health department trade license for food businesses",
        category: "food",
        adapterType: "FoodLicenseAdapter",
        estimatedDays: 14,
        slaDays: 21,
        requiredDocuments: JSON.stringify(["medical_certificates", "food_safety_plan"]),
        requiredFields: JSON.stringify(["name", "businessName", "address", "city", "state"]),
      },
      {
        name: "Final Compliance Approval",
        code: "final_approval",
        departmentId: deptMap.MUNICIPAL,
        description: "Final compliance and approval certificate",
        category: "general",
        adapterType: "MunicipalAdapter",
        estimatedDays: 5,
        slaDays: 10,
        requiredDocuments: JSON.stringify(["all_previous_approvals"]),
        requiredFields: JSON.stringify(["name", "businessName", "address"]),
      },
    ].map(async (s) =>
      prisma.service.create({ data: s })
    )
  );

  console.log(`  ✓ Created ${services.length} services`);

  // ─── Integration Health ──────────────────────────────────────

  const healthStatuses = [
    { department: "business_registration", status: "online", latencyMs: 120, totalRequests: 1247, failedRequests: 12 },
    { department: "municipal_permission", status: "online", latencyMs: 200, totalRequests: 982, failedRequests: 34 },
    { department: "food_license", status: "online", latencyMs: 150, totalRequests: 756, failedRequests: 18 },
    { department: "fire_safety", status: "online", latencyMs: 180, totalRequests: 423, failedRequests: 8 },
    { department: "tax_registration", status: "online", latencyMs: 100, totalRequests: 1589, failedRequests: 6 },
  ];

  for (const h of healthStatuses) {
    await prisma.integrationHealth.create({
      data: {
        ...h,
        uptimePercent: 100 - (h.failedRequests / h.totalRequests) * 100,
      },
    });
  }

  console.log(`  ✓ Created integration health records`);

  // ─── Demo Journeys and Steps ─────────────────────────────────

  const journeyStatuses = ["completed", "in_progress", "in_progress", "created"];
  const stepStatuses = ["approved", "submitted", "in_progress", "waiting", "pending"];

  for (let i = 0; i < 20; i++) {
    const citizen = citizenUsers[i % citizenUsers.length];
    const journeyStatus = journeyStatuses[i % journeyStatuses.length];

    const journey = await prisma.serviceJourney.create({
      data: {
        userId: citizen.id,
        intent: i % 2 === 0 ? "I want to open a restaurant in Pune" : "I want to start a business in Mumbai",
        intentParsed: JSON.stringify({
          intent: i % 2 === 0 ? "restaurant_business_setup" : "business_registration",
          location: i % 2 === 0 ? "Pune" : "Mumbai",
        }),
        status: journeyStatus,
        progress: journeyStatus === "completed" ? 100 : Math.floor(Math.random() * 80),
      },
    });

    // Create 3-6 steps per journey
    const stepCount = 3 + Math.floor(Math.random() * 4);
    const codes = ["business_registration", "tax_registration", "food_license", "municipal_permission", "fire_safety", "final_approval"];
    const activeCodes = codes.slice(0, stepCount);

    for (let j = 0; j < activeCodes.length; j++) {
      const code = activeCodes[j];
      const service = services.find((s) => s.code === code);
      if (!service) continue;

      let stepStatus: string;
      if (journeyStatus === "completed") {
        stepStatus = "approved";
      } else if (j === 0) {
        stepStatus = stepStatuses[Math.floor(Math.random() * 3)]; // first 3 statuses
      } else if (j < stepCount / 2) {
        stepStatus = stepStatuses[Math.floor(Math.random() * 2) + 1];
      } else {
        stepStatus = "waiting";
      }

      await prisma.journeyStep.create({
        data: {
          journeyId: journey.id,
          serviceId: service.id,
          status: stepStatus,
          sequence: j + 1,
          externalApplicationId:
            stepStatus !== "waiting" && stepStatus !== "pending"
              ? `${code.substring(0, 2).toUpperCase()}-${2026}-${10000 + Math.floor(Math.random() * 90000)}`
              : undefined,
          startedAt: stepStatus !== "waiting" && stepStatus !== "pending" ? new Date(Date.now() - (stepCount - j) * 86400000) : undefined,
          completedAt: stepStatus === "approved" ? new Date(Date.now() - (stepCount - j) * 86400000) : undefined,
        },
      });
    }
  }

  console.log(`  ✓ Created 20 demo journeys with steps`);

  // ─── Demo Notifications ──────────────────────────────────────

  const notificationTemplates = [
    { type: "status_update", title: "Business Registration - Approved", message: "Your business registration has been approved. Application ID: BR-2026-10291" },
    { type: "status_update", title: "Food License - Under Review", message: "Your FSSAI application is being reviewed by the department." },
    { type: "alert", title: "Service Temporarily Unavailable", message: "Fire Safety service is temporarily offline. Your request will retry automatically." },
    { type: "system", title: "Welcome to ONEGOV", message: "Your account has been created successfully. Start your service journey today." },
    { type: "reminder", title: "Document Required", message: "Please upload your PAN card for Tax Registration." },
  ];

  for (const citizen of citizenUsers.slice(0, 5)) {
    for (const template of notificationTemplates) {
      await prisma.notification.create({
        data: {
          userId: citizen.id,
          ...template,
          read: Math.random() > 0.5,
        },
      });
    }
  }

  console.log(`  ✓ Created notifications`);

  // ─── Demo Audit Logs ─────────────────────────────────────────

  const auditActions = [
    { action: "user.login", resource: "user" },
    { action: "journey.created", resource: "journey" },
    { action: "journey.step.submitted", resource: "journey_step" },
    { action: "consent.granted", resource: "consent" },
    { action: "integration.request", resource: "integration" },
    { action: "document.uploaded", resource: "document" },
  ];

  for (let i = 0; i < 50; i++) {
    const template = auditActions[i % auditActions.length];
    const user = citizenUsers[i % citizenUsers.length];
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: template.action,
        resource: template.resource,
        resourceId: `res-${i}`,
        metadata: JSON.stringify({ timestamp: new Date(Date.now() - i * 300000).toISOString() }),
      },
    });
  }

  console.log(`  ✓ Created 50 audit log entries`);

  // ─── Demo Integration Requests ───────────────────────────────

  const integrationStatuses = ["success", "success", "success", "success", "failed", "success"];
  const deptNames = ["Business Registration", "Municipal Corporation", "Food Safety", "Fire Department", "Tax Registration"];

  // Get some journey steps
  const steps = await prisma.journeyStep.findMany({ take: 10 });

  for (let i = 0; i < 30; i++) {
    const step = steps[i % steps.length];
    const dept = deptNames[i % deptNames.length];
    const status = integrationStatuses[i % integrationStatuses.length];

    await prisma.integrationRequest.create({
      data: {
        journeyStepId: step.id,
        department: dept,
        endpoint: `/api/${dept.toLowerCase().replace(/\s+/g, "-")}/applications`,
        method: "POST",
        requestPayload: JSON.stringify({ applicant: "Demo User", service: dept }),
        responsePayload: JSON.stringify({ status, message: `Response from ${dept}` }),
        statusCode: status === "success" ? 200 : 503,
        status,
        latencyMs: 100 + Math.floor(Math.random() * 500),
        errorMessage: status === "failed" ? "Service temporarily unavailable" : undefined,
      },
    });
  }

  console.log(`  ✓ Created 30 integration request logs`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
