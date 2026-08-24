import { NextRequest, NextResponse } from "next/server";
import { getServiceHealth, setServiceStatus } from "@/lib/integrations/gateway";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAuditEvent, AuditActions } from "@/lib/audit/service";

export async function GET() {
  try {
    const health = getServiceHealth();

    // Merge with database health records
    const dbHealth = await prisma.integrationHealth.findMany();
    const dbHealthMap = Object.fromEntries(
      dbHealth.map((h) => [h.department, h])
    );

    const result = health.map((h) => ({
      ...h,
      department: h.department,
      displayName: h.department.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      totalRequests: dbHealthMap[h.department]?.totalRequests || 0,
      failedRequests: dbHealthMap[h.department]?.failedRequests || 0,
      uptimePercent: dbHealthMap[h.department]?.uptimePercent || 100,
    }));

    return NextResponse.json({ health: result });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { department, status } = await request.json();
    if (!department || !status) {
      return NextResponse.json(
        { error: "department and status are required" },
        { status: 400 }
      );
    }

    setServiceStatus(department, status);

    // Update database health record
    await prisma.integrationHealth.upsert({
      where: { department },
      update: { status, lastCheckedAt: new Date() },
      create: {
        department,
        status,
        lastCheckedAt: new Date(),
      },
    });

    await logAuditEvent(
      user.userId,
      AuditActions.SIMULATION_TOGGLED,
      "integration",
      undefined,
      { department, status }
    );

    return NextResponse.json({ success: true, department, status });
  } catch (error) {
    console.error("Simulation toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
