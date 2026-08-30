import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mock-data";

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

    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        profile: userData.profile || null,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = MOCK_USERS[user.email];
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { field, value } = body;

    if (!field) {
      return NextResponse.json({ error: "Field is required" }, { status: 400 });
    }

    // Whitelist of fields citizens can update
    const allowedFields = [
      "name", "phone", "address", "city", "state", "pincode",
      "dateOfBirth", "gender", "fatherName", "motherName",
      "aadhaarNumber", "panNumber", "gstNumber", "voterId",
      "passportNumber", "drivingLicense",
      "businessName", "businessType", "occupation", "annualIncome",
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: "Field not allowed for update" }, { status: 403 });
    }

    if (!userData.profile) {
      userData.profile = {};
    }

    userData.profile[field] = value;

    // Also update name/phone at root level if changed
    if (field === "name") userData.name = value;
    if (field === "phone") userData.phone = value;

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        profile: userData.profile,
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
