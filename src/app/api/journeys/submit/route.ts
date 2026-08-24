import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { journeyStepId } = await request.json();
    if (!journeyStepId) {
      return NextResponse.json(
        { error: "journeyStepId is required" },
        { status: 400 }
      );
    }

    // Simulate submission
    return NextResponse.json({
      success: true,
      applicationId: `APP-2026-${10000 + Math.floor(Math.random() * 90000)}`,
      status: "submitted",
      correlationId: `corr-${Date.now()}`,
      latencyMs: 150 + Math.floor(Math.random() * 350),
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
