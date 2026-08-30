import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mock-data";

// Mock Aadhaar database — matches real UIDAI response format
const MOCK_AADHAAR_DB: Record<string, {
  name: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  fatherName: string;
  photo: string;
}> = {
  "452178903456": {
    name: "ADARSH RAJ",
    dob: "14/07/1992",
    gender: "Male",
    address: "42, MG Road, Near Deccan Gymkhana, Pune, Maharashtra — 411004",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411004",
    phone: "9876543210",
    fatherName: "SURESH RAJ",
    photo: "verified",
  },
  "893456127890": {
    name: "PRIYA SHARMA",
    dob: "20/05/1988",
    gender: "Female",
    address: "15, Linking Road, Bandra West, Mumbai, Maharashtra — 400050",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    phone: "9876543211",
    fatherName: "RAJESH SHARMA",
    photo: "verified",
  },
};

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

// Step 1: Send OTP (simulated)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { step, aadhaarNumber, otp } = body;

    if (step === "send_otp") {
      // Validate Aadhaar number format
      const clean = aadhaarNumber?.replace(/\s/g, "");
      if (!clean || clean.length !== 12 || !/^\d{12}$/.test(clean)) {
        return NextResponse.json({ error: "Invalid Aadhaar number. Must be 12 digits." }, { status: 400 });
      }

      // Check if Aadhaar exists in mock DB
      if (!MOCK_AADHAAR_DB[clean]) {
        return NextResponse.json({ error: "Aadhaar number not found in our records." }, { status: 404 });
      }

      // Simulate OTP sent (in real: UIDAI sends OTP to registered mobile)
      const maskedPhone = MOCK_AADHAAR_DB[clean].phone;
      return NextResponse.json({
        success: true,
        message: `OTP sent to registered mobile number ${maskedPhone.slice(0, 4)}XXXX${maskedPhone.slice(-2)}`,
        otpHint: "123456", // For demo — in production this is server-side only
      });
    }

    if (step === "verify_otp") {
      const clean = aadhaarNumber?.replace(/\s/g, "");
      if (!clean || !MOCK_AADHAAR_DB[clean]) {
        return NextResponse.json({ error: "Aadhaar not found" }, { status: 404 });
      }

      // For demo: accept "123456" as valid OTP
      if (otp !== "123456") {
        return NextResponse.json({ error: "Invalid OTP. For demo, use: 123456" }, { status: 400 });
      }

      const aadhaarData = MOCK_AADHAAR_DB[clean];

      // Auto-populate user profile with Aadhaar data (DigiLocker-style)
      const userData = MOCK_USERS[user.email];
      if (userData && userData.profile) {
        // Extract and map Aadhaar data to profile fields
        userData.profile.aadhaarNumber = `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8)}`;
        userData.profile.name = aadhaarData.name.split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
        userData.profile.dateOfBirth = aadhaarData.dob.split("/").reverse().join("-"); // Convert DD/MM/YYYY to YYYY-MM-DD
        userData.profile.gender = aadhaarData.gender;
        userData.profile.address = aadhaarData.address;
        userData.profile.city = aadhaarData.city;
        userData.profile.state = aadhaarData.state;
        userData.profile.pincode = aadhaarData.pincode;
        userData.profile.fatherName = aadhaarData.fatherName.split(" ").map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
        userData.profile.aadhaarVerified = "true";
        userData.profile.aadhaarVerifiedAt = new Date().toISOString();
      }

      // Return verified data
      return NextResponse.json({
        success: true,
        verified: true,
        message: "Aadhaar verified successfully. Your profile has been auto-populated.",
        extractedData: {
          name: aadhaarData.name,
          dob: aadhaarData.dob,
          gender: aadhaarData.gender,
          address: aadhaarData.address,
          city: aadhaarData.city,
          state: aadhaarData.state,
          pincode: aadhaarData.pincode,
          phone: aadhaarData.phone,
          fatherName: aadhaarData.fatherName,
          photo: aadhaarData.photo,
        },
        profileUpdated: {
          name: userData?.profile?.name,
          dateOfBirth: userData?.profile?.dateOfBirth,
          gender: userData?.profile?.gender,
          address: userData?.profile?.address,
          city: userData?.profile?.city,
          state: userData?.profile?.state,
          pincode: userData?.profile?.pincode,
          fatherName: userData?.profile?.fatherName,
        },
      });
    }

    return NextResponse.json({ error: "Invalid step. Use 'send_otp' or 'verify_otp'." }, { status: 400 });
  } catch (error) {
    console.error("Aadhaar verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: Check verification status
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
    const isVerified = profile.aadhaarVerified === "true";

    return NextResponse.json({
      aadhaarVerified: isVerified,
      verifiedAt: profile.aadhaarVerifiedAt || null,
      aadhaarNumber: profile.aadhaarNumber || null,
      extractedFields: isVerified ? {
        name: profile.name,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        fatherName: profile.fatherName,
      } : null,
    });
  } catch (error) {
    console.error("Verification status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
