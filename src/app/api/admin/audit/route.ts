import { NextRequest, NextResponse } from "next/server";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data";

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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user || (user.role !== "admin" && user.role !== "officer")) {
      return NextResponse.json({ error: "Admin or officer access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    return NextResponse.json({
      logs: MOCK_AUDIT_LOGS,
      total: MOCK_AUDIT_LOGS.length,
      page,
      limit,
      totalPages: 1,
    });
  } catch (error) {
    console.error("Audit logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
