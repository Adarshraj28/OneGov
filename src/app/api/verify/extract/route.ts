import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mock-data";

// Mock government portal databases — simulates real API responses from official portals
const GOVERNMENT_DOCUMENTS: Record<string, Record<string, Record<string, string>>> = {
  // UIDAI Aadhaar data
  uidai: {
    "452178903456": {
      name: "ADARSH RAJ", dob: "14/07/1992", gender: "Male",
      address: "42, MG Road, Near Deccan Gymkhana, Pune, Maharashtra — 411004",
      city: "Pune", state: "Maharashtra", pincode: "411004",
      phone: "9876543210", fatherName: "SURESH RAJ",
      verificationSource: "UIDAI", verificationId: "UIDAI-2026-AAD-8834",
      extractedAt: new Date().toISOString(),
    },
    "893456127890": {
      name: "PRIYA SHARMA", dob: "20/05/1988", gender: "Female",
      address: "15, Linking Road, Bandra West, Mumbai, Maharashtra — 400050",
      city: "Mumbai", state: "Maharashtra", pincode: "400050",
      phone: "9876543211", fatherName: "RAJESH SHARMA",
      verificationSource: "UIDAI", verificationId: "UIDAI-2026-AAD-9912",
      extractedAt: new Date().toISOString(),
    },
  },
  // NSDL PAN data (linked to Aadhaar)
  nsdl: {
    "452178903456": {
      pan: "AXPRR4521M", name: "ADARSH RAJ", dob: "14/07/1992",
      fatherName: "SURESH RAJ", status: "ACTIVE",
      verificationSource: "NSDL", verificationId: "NSDL-2026-PAN-44521",
      extractedAt: new Date().toISOString(),
    },
    "893456127890": {
      pan: "BTPPS7890K", name: "PRIYA SHARMA", dob: "20/05/1988",
      fatherName: "RAJESH SHARMA", status: "ACTIVE",
      verificationSource: "NSDL", verificationId: "NSDL-2026-PAN-55632",
      extractedAt: new Date().toISOString(),
    },
  },
  // Passport Seva (MEA)
  mea: {
    "452178903456": {
      passportNumber: "R1234567", name: "ADARSH RAJ", dob: "14/07/1992",
      issueDate: "15/03/2022", expiryDate: "14/03/2032", status: "ACTIVE",
      type: "ORDINARY", placeOfBirth: "PUNE",
      verificationSource: "MEA/Passport Seva", verificationId: "MEA-2026-PP-77823",
      extractedAt: new Date().toISOString(),
    },
  },
  // Parivahan DL
  morth: {
    "452178903456": {
      dlNumber: "MH1220230004567", name: "ADARSH RAJ", dob: "14/07/1992",
      issueDate: "20/06/2023", validUpto: "19/06/2043", status: "ACTIVE",
      vehicleClass: "LMV", issuingAuthority: "RTO Pune",
      verificationSource: "Parivahan/MORTH", verificationId: "MORTH-2026-DL-33218",
      extractedAt: new Date().toISOString(),
    },
  },
  // ECI Voter ID
  eci: {
    "452178903456": {
      voterId: "MXR1234567", name: "ADARSH RAJ", dob: "14/07/1992",
      gender: "Male", address: "42, MG Road, Pune", assembly: "Pune City",
      status: "ACTIVE",
      verificationSource: "ECI/NVSP", verificationId: "ECI-2026-VID-88431",
      extractedAt: new Date().toISOString(),
    },
  },
  // MCA Business Registration
  mca: {
    "452178903456": {
      cin: "U56100MH2024PTC123456", companyName: "ADARSH FOOD HUB PRIVATE LIMITED",
      status: "ACTIVE", dateOfIncorporation: "15/03/2024",
      registeredAddress: "42, MG Road, Pune, Maharashtra",
      directorName: "ADARSH RAJ", directorDin: "07891234",
      verificationSource: "MCA", verificationId: "MCA-2026-CIN-22145",
      extractedAt: new Date().toISOString(),
    },
  },
  // GST
  gstn: {
    "452178903456": {
      gstNumber: "27AXPRR4521M1ZQ", businessName: "ADARSH FOOD HUB PRIVATE LIMITED",
      state: "Maharashtra", status: "ACTIVE", registrationDate: "20/03/2024",
      verificationSource: "GSTN", verificationId: "GSTN-2026-GST-66734",
      extractedAt: new Date().toISOString(),
    },
  },
};

// Extractable document types
const EXTRACTABLE_DOCS = [
  { portal: "uidai", type: "aadhaar", name: "Aadhaar Card", icon: "fingerprint", requiresAadhaar: true },
  { portal: "nsdl", type: "pan", name: "PAN Card", icon: "credit-card", requiresAadhaar: true },
  { portal: "mea", type: "passport", name: "Passport", icon: "book-open", requiresAadhaar: true },
  { portal: "morth", type: "driving_license", name: "Driving License", icon: "car", requiresAadhaar: true },
  { portal: "eci", type: "voter_id", name: "Voter ID", icon: "vote", requiresAadhaar: true },
  { portal: "mca", type: "business_cert", name: "Certificate of Incorporation", icon: "building", requiresAadhaar: false },
  { portal: "gstn", type: "gst", name: "GST Registration", icon: "receipt", requiresAadhaar: false },
];

async function getUserFromCookie() {
  try {
    const { cookies } = await import("next/headers");
    const { jwtVerify } = await import("jose");
    const cookieStore = await cookies();
    const token = cookieStore.get("onegov-token")?.value;
    if (!token) return null;
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "onegov-secret-key-prototype-2026"
    );
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; role: string; name: string };
  } catch {
    return null;
  }
}

// POST: Extract documents from government portals
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { aadhaarNumber, portal, documentType } = body;

    if (!aadhaarNumber) {
      return NextResponse.json({ error: "Aadhaar number is required for document extraction" }, { status: 400 });
    }

    const clean = aadhaarNumber.replace(/\s/g, "");

    // Check Aadhaar verification status
    const userData = MOCK_USERS[user.email];
    if (!userData?.profile?.aadhaarVerified || userData.profile.aadhaarVerified !== "true") {
      return NextResponse.json({
        error: "Aadhaar must be verified before extracting documents. Please verify your Aadhaar first.",
        requiresVerification: true,
      }, { status: 403 });
    }

    // Extract from specific portal or all available
    if (portal) {
      const portalData = GOVERNMENT_DOCUMENTS[portal]?.[clean];
      if (!portalData) {
        return NextResponse.json({
          success: false,
          message: `No documents found on ${portal.toUpperCase()} for this Aadhaar.`,
          documents: [],
        });
      }
      return NextResponse.json({
        success: true,
        portal,
        documents: [{ ...portalData, type: documentType || portal }],
      });
    }

    // Extract all available documents
    const extractedDocuments: Array<Record<string, string> & { type: string }> = [];
    for (const [portalKey, portalData] of Object.entries(GOVERNMENT_DOCUMENTS)) {
      if (portalData[clean]) {
        const docType = EXTRACTABLE_DOCS.find((d) => d.portal === portalKey);
        extractedDocuments.push({
          ...portalData[clean],
          type: docType?.type || portalKey,
        });
      }
    }

    // Update profile with extracted data
    if (userData?.profile) {
      const aadhaarData = GOVERNMENT_DOCUMENTS.uidai[clean];
      if (aadhaarData) {
        userData.profile.aadhaarNumber = `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
        userData.profile.name = aadhaarData.name.split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
        userData.profile.dateOfBirth = aadhaarData.dob.split("/").reverse().join("-");
        userData.profile.gender = aadhaarData.gender;
        userData.profile.address = aadhaarData.address;
        userData.profile.city = aadhaarData.city;
        userData.profile.state = aadhaarData.state;
        userData.profile.pincode = aadhaarData.pincode;
        userData.profile.fatherName = aadhaarData.fatherName.split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
        userData.profile.phone = aadhaarData.phone;
      }

      const panData = GOVERNMENT_DOCUMENTS.nsdl[clean];
      if (panData) userData.profile.panNumber = panData.pan;

      const passportData = GOVERNMENT_DOCUMENTS.mea[clean];
      if (passportData) userData.profile.passportNumber = passportData.passportNumber;

      const dlData = GOVERNMENT_DOCUMENTS.morth[clean];
      if (dlData) userData.profile.drivingLicense = dlData.dlNumber;

      const voterData = GOVERNMENT_DOCUMENTS.eci[clean];
      if (voterData) userData.profile.voterId = voterData.voterId;

      const businessData = GOVERNMENT_DOCUMENTS.mca[clean];
      if (businessData) {
        userData.profile.businessName = businessData.companyName;
        userData.profile.cinNumber = businessData.cin;
      }

      const gstData = GOVERNMENT_DOCUMENTS.gstn[clean];
      if (gstData) {
        userData.profile.gstNumber = gstData.gstNumber;
        userData.profile.businessName = gstData.businessName;
      }

      userData.profile.documentsExtracted = "true";
      userData.profile.documentsExtractedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: `Extracted ${extractedDocuments.length} documents from ${Object.keys(GOVERNMENT_DOCUMENTS).length} government portals`,
      documents: extractedDocuments,
      portalsSearched: Object.keys(GOVERNMENT_DOCUMENTS),
      extractedCount: extractedDocuments.length,
    });
  } catch (error) {
    console.error("Document extraction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Check extraction status
export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = MOCK_USERS[user.email];
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = userData.profile || {};
    return NextResponse.json({
      aadhaarVerified: profile.aadhaarVerified === "true",
      documentsExtracted: profile.documentsExtracted === "true",
      extractedAt: profile.documentsExtractedAt || null,
      availablePortals: Object.keys(GOVERNMENT_DOCUMENTS),
      extractableDocTypes: EXTRACTABLE_DOCS,
    });
  } catch (error) {
    console.error("Extraction status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
