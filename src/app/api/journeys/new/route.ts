import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOURNEYS, MOCK_SERVICES } from "@/lib/mock-data";
import { getAIEngine } from "@/lib/ai";

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

    // Use the AI engine to analyze the intent
    const engine = getAIEngine();
    const { response, contextId } = await engine.chat(user.userId, intent);

    // Extract intent and entities from the AI response
    const intentCategory = response.metadata?.intent || "GENERAL_INQUIRY";
    const entities = response.metadata?.entities;

    // Map intent to service codes using the AI's knowledge
    const serviceCodeMap: Record<string, string[]> = {
      OPEN_RESTAURANT: [
        "business_registration", "tax_registration", "food_license",
        "municipal_permission", "fire_safety", "shop_establishment",
      ],
      OPEN_FOOD_BUSINESS: [
        "business_registration", "tax_registration", "food_license",
        "municipal_permission",
      ],
      START_BUSINESS: [
        "business_registration", "tax_registration", "municipal_permission",
        "shop_establishment",
      ],
      REGISTER_COMPANY: [
        "business_registration", "tax_registration", "shop_establishment",
      ],
      GET_PASSPORT: ["passport"],
      GET_DRIVING_LICENSE: ["driving_license"],
      UPDATE_AADHAAR: ["aadhaar_update"],
      GET_PAN_CARD: ["pan_card"],
      REGISTER_VOTER_ID: ["voter_id"],
      PROPERTY_REGISTRATION: ["property_registration", "municipal_permission"],
      BIRTH_CERTIFICATE: ["birth_certificate"],
      MARRIAGE_REGISTRATION: ["marriage_registration"],
      INCOME_CERTIFICATE: ["income_certificate"],
      CASTE_CERTIFICATE: ["caste_certificate"],
      RATION_CARD: ["ration_card"],
    };

    const serviceCodes = serviceCodeMap[intentCategory] || [
      "business_registration", "tax_registration", "municipal_permission",
    ];

    const services = MOCK_SERVICES.filter((s) =>
      serviceCodes.includes(s.code)
    );

    const journeyId = `journey-${Date.now()}`;
    const newJourney = {
      id: journeyId,
      intent,
      intentParsed: JSON.stringify({
        intent: intentCategory,
        entities,
        contextId,
      }),
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
        intent: intentCategory,
        confidence: response.metadata?.confidence || 0.8,
        entities,
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
