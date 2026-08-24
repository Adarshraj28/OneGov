import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { submitToExternalService, serviceHealth } from "@/lib/integrations/gateway";
import { notifyJourneyStepUpdate, notifyServiceOffline } from "@/lib/notifications/service";
import { logAuditEvent, AuditActions } from "@/lib/audit/service";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { journeyStepId, data } = await request.json();
    if (!journeyStepId) {
      return NextResponse.json(
        { error: "journeyStepId is required" },
        { status: 400 }
      );
    }

    // Get the journey step with service info
    const step = await prisma.journeyStep.findUnique({
      where: { id: journeyStepId },
      include: {
        service: {
          include: { department: true },
        },
        journey: true,
      },
    });

    if (!step) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    // Check if step is in a submittable state
    if (step.status !== "in_progress" && step.status !== "pending") {
      return NextResponse.json(
        { error: `Cannot submit step in status: ${step.status}` },
        { status: 400 }
      );
    }

    // Update step to submitted
    await prisma.journeyStep.update({
      where: { id: journeyStepId },
      data: { status: "submitted" },
    });

    // Get user profile data for the submission
    const profile = await prisma.citizenProfile.findUnique({
      where: { userId: user.userId },
    });

    const submissionData = {
      name: user.name,
      email: user.email,
      phone: "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "Maharashtra",
      pincode: profile?.pincode || "",
      panNumber: profile?.panNumber || "",
      businessName: profile?.businessName || "",
      businessType: profile?.businessType || "",
      ...data,
    };

    // Check if service is available
    const health = serviceHealth[step.service.code];
    if (!health || health.status === "offline") {
      await prisma.journeyStep.update({
        where: { id: journeyStepId },
        data: {
          status: "failed",
          failureReason: "Service temporarily unavailable",
          retryCount: step.retryCount + 1,
        },
      });

      await notifyServiceOffline(user.userId, step.service.name);
      await logAuditEvent(
        user.userId,
        AuditActions.INTEGRATION_FAILED,
        "integration",
        undefined,
        { department: step.service.department.name, reason: "Service offline" }
      );

      return NextResponse.json({
        success: false,
        error: "Service temporarily unavailable. Your request has been saved.",
        status: "failed",
        retryScheduled: true,
      });
    }

    // Submit to external service
    const response = await submitToExternalService({
      journeyStepId,
      serviceCode: step.service.code,
      department: step.service.department.name,
      payload: submissionData,
    });

    if (response.success) {
      await prisma.journeyStep.update({
        where: { id: journeyStepId },
        data: {
          status: "submitted",
          externalApplicationId: response.applicationId,
        },
      });

      await notifyJourneyStepUpdate(
        user.userId,
        step.service.name,
        "submitted",
        step.journeyId
      );

      await logAuditEvent(
        user.userId,
        AuditActions.JOURNEY_STEP_SUBMITTED,
        "journey_step",
        journeyStepId,
        {
          department: step.service.department.name,
          applicationId: response.applicationId,
          correlationId: response.correlationId,
          latencyMs: response.latencyMs,
        }
      );
    } else {
      await prisma.journeyStep.update({
        where: { id: journeyStepId },
        data: {
          status: "failed",
          failureReason: response.error || "Submission failed",
          retryCount: step.retryCount + 1,
        },
      });

      await notifyJourneyStepUpdate(
        user.userId,
        step.service.name,
        "failed",
        step.journeyId
      );
    }

    return NextResponse.json({
      success: response.success,
      applicationId: response.applicationId,
      status: response.status,
      correlationId: response.correlationId,
      latencyMs: response.latencyMs,
      error: response.error,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
