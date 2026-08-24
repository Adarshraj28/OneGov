import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { analyzeRequest } from "@/lib/services/registry";
import { createJourney } from "@/lib/workflow/engine";
import { logAuditEvent, AuditActions } from "@/lib/audit/service";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
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

    // Analyze the request through AI service discovery
    const analysis = await analyzeRequest(intent);

    // Create the journey with workflow steps
    const { journey, steps } = await createJourney(
      user.userId,
      intent,
      analysis.intent as unknown as Record<string, unknown>,
      analysis.services.map((s) => ({
        serviceId: s.serviceId,
        code: s.code,
        name: s.name,
        department: s.department,
        description: s.description,
        dependencies: s.dependencies,
        estimatedDays: s.estimatedDays,
      }))
    );

    await logAuditEvent(
      user.userId,
      AuditActions.JOURNEY_CREATED,
      "journey",
      journey.id,
      { intent, serviceCount: analysis.services.length }
    );

    return NextResponse.json({
      success: true,
      journey: {
        id: journey.id,
        intent: journey.intent,
        status: journey.status,
        progress: journey.progress,
        createdAt: journey.createdAt,
      },
      analysis: {
        intent: analysis.intent,
        totalSteps: analysis.totalSteps,
        estimatedTotalDays: analysis.estimatedTotalDays,
      },
      steps: steps.map((s) => ({
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
