import { NextResponse } from "next/server";
import { MOCK_JOURNEYS, MOCK_SERVICES, MOCK_INTEGRATION_HEALTH, MOCK_AUDIT_LOGS, MOCK_USERS } from "@/lib/mock-data";

export async function GET() {
  try {
    const totalUsers = Object.keys(MOCK_USERS).length;
    const totalCitizens = Object.values(MOCK_USERS).filter((u) => u.role === "citizen").length;
    const totalOfficers = Object.values(MOCK_USERS).filter((u) => u.role === "officer").length;
    const totalJourneys = MOCK_JOURNEYS.length;
    const completedJourneys = MOCK_JOURNEYS.filter((j) => j.status === "completed").length;
    const inProgressJourneys = MOCK_JOURNEYS.filter((j) => j.status === "in_progress").length;
    const blockedJourneys = MOCK_JOURNEYS.filter((j) => j.status === "failed").length;
    const createdJourneys = MOCK_JOURNEYS.filter((j) => j.status === "created").length;
    const totalIntegrations = 200;
    const failedIntegrations = 12;
    const successRate = ((totalIntegrations - failedIntegrations) / totalIntegrations) * 100;

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
        totalServices: MOCK_SERVICES.length,
        totalDepartments: 5,
        totalIntegrations,
        failedIntegrations,
        successRate: Math.round(successRate * 10) / 10,
        recoveredAutomatically: 8,
      },
      integrationHealth: MOCK_INTEGRATION_HEALTH,
      bottlenecks: [
        { serviceName: "Municipal Permission", department: "Municipal Corporation", pendingCount: 12, avgRetries: 1.5 },
        { serviceName: "Fire Safety NOC", department: "Fire Department", pendingCount: 8, avgRetries: 0.8 },
      ],
      recentActivity: MOCK_AUDIT_LOGS,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
