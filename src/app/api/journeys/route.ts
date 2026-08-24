import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOURNEYS, MOCK_USERS } from "@/lib/mock-data";

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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const journeyId = searchParams.get("id");

    if (journeyId) {
      const journey = MOCK_JOURNEYS.find((j) => j.id === journeyId);
      if (!journey) {
        return NextResponse.json({ error: "Journey not found" }, { status: 404 });
      }
      return NextResponse.json({ journey });
    }

    let journeys;
    if (user.role === "officer" || user.role === "admin") {
      journeys = MOCK_JOURNEYS;
    } else {
      journeys = MOCK_JOURNEYS.filter((j) => j.userId === user.userId);
    }

    return NextResponse.json({ journeys });
  } catch (error) {
    console.error("Journeys error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
