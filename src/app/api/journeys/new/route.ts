import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOURNEYS, MOCK_SERVICES } from "@/lib/mock-data";

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

    const { intent } = await request.json();
    if (!intent || typeof intent !== "string") {
      return NextResponse.json(
        { error: "Intent is required" },
        { status: 400 }
      );
    }

    // Simulate intent analysis
    const isRestaurant = intent.toLowerCase().includes("restaurant") || intent.toLowerCase().includes("food");
    const services = isRestaurant
      ? MOCK_SERVICES.filter((s) => ["business_registration", "food_license", "fire_safety"].includes(s.code))
      : MOCK_SERVICES.filter((s) => ["business_registration", "tax_registration", "municipal_permission"].includes(s.code));

    const journeyId = `journey-${Date.now()}`;
    const newJourney = {
      id: journeyId,
      intent,
      status: "in_progress",
      progress: 0,
      createdAt: new Date().toISOString(),
      userId: user.userId,
      user: { id: user.userId, name: user.name, email: user.email },
      steps: services.map((svc, i) => ({
        id: `step-${journeyId}-${i + 1}`,
        journeyId,
        serviceId: svc.id,
        service: svc,
        status: i === 0 ? "in_progress" : "pending",
        sequence: i + 1,
        externalApplicationId: null,
        startedAt: null,
        completedAt: null,
        retryCount: 0,
        maxRetries: 3,
      })),
    };

    // Add to mock data
    MOCK_JOURNEYS.push(newJourney);

    return NextResponse.json({
      success: true,
      journey: {
        id: newJourney.id,
        intent: newJourney.intent,
        status: newJourney.status,
        progress: newJourney.progress,
        createdAt: newJourney.createdAt,
      },
      analysis: {
        intent: isRestaurant ? "restaurant_business_setup" : "business_registration",
        totalSteps: services.length,
        estimatedTotalDays: services.reduce((sum, s) => sum + s.estimatedDays, 0),
      },
      steps: newJourney.steps.map((s) => ({
        id: s.id,
        sequence: s.sequence,
        status: s.status,
        service: {
          id: s.service.id,
          name: s.service.name,
          code: s.service.code,
          department: s.service.department.name,
          description: s.service.description,
          estimatedDays: s.service.estimatedDays,
        },
      })),
    });
  } catch (error) {
    console.error("Journey creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
