import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const prisma = new PrismaClient();

  // Check if users exist
  const count = await prisma.user.count();
  if (count > 0) {
    console.log("✅ Database already seeded, skipping...");
    await prisma.$disconnect();
    return;
  }

  console.log("🌱 Database is empty, seeding...");

  const passwordHash = await bcrypt.hash("password123", 12);

  // Seed users
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
        data: { ...u, passwordHash, role: "citizen" },
      });
      await prisma.citizenProfile.create({
        data: {
          userId: user.id,
          address: "123 Main Street",
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

  await Promise.all(
    [
      { name: "Dr. Rajesh Kulkarni", email: "rajesh@officer.gov", phone: "9876500001" },
      { name: "Sunita Bhave", email: "sunita@officer.gov", phone: "9876500002" },
      { name: "Manoj Deshpande", email: "manoj@officer.gov", phone: "9876500003" },
    ].map((u) =>
      prisma.user.create({ data: { ...u, passwordHash, role: "officer" } })
    )
  );

  await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@onegov.gov",
      phone: "9876500000",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`  ✓ Created ${citizenUsers.length} citizens, 3 officers, 1 admin`);

  // Seed departments
  const departments = await Promise.all(
    [
      { name: "Ministry of Corporate Affairs", code: "MCA", icon: "building", color: "#1e40af" },
      { name: "Municipal Corporation", code: "MUNICIPAL", icon: "landmark", color: "#0369a1" },
      { name: "Food Safety (FSSAI)", code: "FSSAI", icon: "utensils", color: "#15803d" },
      { name: "Fire Department", code: "FIRE", icon: "flame", color: "#dc2626" },
      { name: "Income Tax Department", code: "ITD", icon: "receipt", color: "#7c3aed" },
    ].map((d) => prisma.department.create({ data: d }))
  );

  const deptMap = Object.fromEntries(departments.map((d) => [d.code, d.id]));

  // Seed services
  await Promise.all(
    [
      { name: "Business Registration", code: "business_registration", departmentId: deptMap.MCA, description: "Register your business entity", category: "business", adapterType: "BusinessRegistrationAdapter", estimatedDays: 7, slaDays: 14, requiredDocuments: JSON.stringify(["identity_proof", "address_proof", "business_plan"]), requiredFields: JSON.stringify(["name", "email", "phone", "address", "city", "state", "pincode", "panNumber", "businessName", "businessType"]) },
      { name: "Tax Registration (GST)", code: "tax_registration", departmentId: deptMap.ITD, description: "Register for GST", category: "tax", adapterType: "TaxAdapter", estimatedDays: 5, slaDays: 10, requiredDocuments: JSON.stringify(["pan_card", "address_proof", "business_registration"]), requiredFields: JSON.stringify(["name", "panNumber", "address", "city", "state", "pincode", "businessName", "businessType"]) },
      { name: "Food License (FSSAI)", code: "food_license", departmentId: deptMap.FSSAI, description: "Obtain food safety license", category: "food", adapterType: "FoodLicenseAdapter", estimatedDays: 21, slaDays: 30, requiredDocuments: JSON.stringify(["business_registration", "pan_card", "floor_plan", "health_certificates"]), requiredFields: JSON.stringify(["name", "panNumber", "businessName", "address", "city", "state", "businessType"]) },
      { name: "Municipal Permission", code: "municipal_permission", departmentId: deptMap.MUNICIPAL, description: "Obtain municipal permission", category: "municipal", adapterType: "MunicipalAdapter", estimatedDays: 14, slaDays: 21, requiredDocuments: JSON.stringify(["business_registration", "property_document", "noc", "fire_safety"]), requiredFields: JSON.stringify(["name", "address", "city", "state", "pincode", "businessName", "businessType"]) },
      { name: "Fire Safety NOC", code: "fire_safety", departmentId: deptMap.FIRE, description: "Obtain fire safety NOC", category: "safety", adapterType: "FireSafetyAdapter", estimatedDays: 10, slaDays: 14, requiredDocuments: JSON.stringify(["building_plan", "fire_safety_measures", "emergency_exit_plan"]), requiredFields: JSON.stringify(["name", "address", "city", "state", "businessName", "businessType"]) },
      { name: "Final Compliance Approval", code: "final_approval", departmentId: deptMap.MUNICIPAL, description: "Final compliance certificate", category: "general", adapterType: "MunicipalAdapter", estimatedDays: 5, slaDays: 10, requiredDocuments: JSON.stringify(["all_previous_approvals"]), requiredFields: JSON.stringify(["name", "businessName", "address"]) },
    ].map((s) => prisma.service.create({ data: s }))
  );

  // Seed integration health
  for (const h of [
    { department: "business_registration", status: "online", latencyMs: 120, totalRequests: 1247, failedRequests: 12 },
    { department: "municipal_permission", status: "online", latencyMs: 200, totalRequests: 982, failedRequests: 34 },
    { department: "food_license", status: "online", latencyMs: 150, totalRequests: 756, failedRequests: 18 },
    { department: "fire_safety", status: "online", latencyMs: 180, totalRequests: 423, failedRequests: 8 },
    { department: "tax_registration", status: "online", latencyMs: 100, totalRequests: 1589, failedRequests: 6 },
  ]) {
    await prisma.integrationHealth.create({
      data: { ...h, uptimePercent: 100 - (h.failedRequests / h.totalRequests) * 100 },
    });
  }

  console.log("✅ Seed complete!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
