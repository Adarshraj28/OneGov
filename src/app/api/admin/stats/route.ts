import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServiceHealth } from "@/lib/integrations/gateway";

export async function GET() {
  try {
    const [
      totalUsers,
      totalCitizens,
      totalOfficers,
      totalJourneys,
      completedJourneys,
      inProgressJourneys,
      blockedJourneys,
      createdJourneys,
      totalServices,
      totalDepartments,
      totalIntegrations,
      failedIntegrations,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "citizen" } }),
      prisma.user.count({ where: { role: "officer" } }),
      prisma.serviceJourney.count(),
      prisma.serviceJourney.count({ where: { status: "completed" } }),
      prisma.serviceJourney.count({ where: { status: "in_progress" } }),
      prisma.serviceJourney.count({ where: { status: "failed" } }),
      prisma.serviceJourney.count({ where: { status: "created" } }),
      prisma.service.count({ where: { status: "active" } }),
      prisma.department.count({ where: { status: "active" } }),
      prisma.integrationRequest.count(),
      prisma.integrationRequest.count({ where: { status: "failed" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    const health = getServiceHealth();
    const successRate =
      totalIntegrations > 0
        ? ((totalIntegrations - failedIntegrations) / totalIntegrations) * 100
        : 100;

    // Bottleneck analysis - find steps with most delays
    const bottleneckData = await prisma.journeyStep.groupBy({
      by: ["serviceId"],
      _count: { id: true },
      _avg: { retryCount: true },
      where: { status: { in: ["failed", "waiting"] } },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const bottleneckServices = await Promise.all(
      bottleneckData.map(async (b) => {
        const service = await prisma.service.findUnique({
          where: { id: b.serviceId },
          include: { department: true },
        });
        return {
          serviceName: service?.name || "Unknown",
          department: service?.department.name || "Unknown",
          pendingCount: b._count.id,
          avgRetries: b._avg.retryCount || 0,
        };
      })
    );

    return NextResponse.json({
      overview: {
        totalUsers,
        totalCitizens,
        totalOfficers,
        totalJourneys,
        completedJourneys,
        inProgressJourneys,
        blockedJourneys,
        createdJourneys,
        totalServices,
        totalDepartments,
        totalIntegrations,
        failedIntegrations,
        successRate: Math.round(successRate * 10) / 10,
        recoveredAutomatically: failedIntegrations - (blockedJourneys || 0),
      },
      integrationHealth: health,
      bottlenecks: bottleneckServices,
      recentActivity: recentAuditLogs,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
