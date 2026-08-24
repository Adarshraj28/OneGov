import { NextResponse } from "next/server";
import { getInteroperabilityManager } from "@/lib/interoperability";

export async function GET() {
  const manager = getInteroperabilityManager();

  const health = manager.getSystemHealth();
  const consentStats = {
    total: manager.consent.getUserConsents("citizen-001").length +
           manager.consent.getUserConsents("citizen-002").length,
    approved: 2,
    pending: 0,
    revoked: 0,
  };

  const notificationStats = {
    total: manager.notifications.getUserNotifications("citizen-001").length +
           manager.notifications.getUserNotifications("citizen-002").length,
    unread: manager.notifications.getUnreadCount("citizen-001") +
            manager.notifications.getUnreadCount("citizen-002"),
  };

  return NextResponse.json({
    status: "healthy",
    framework: {
      name: "ONEGOV Interoperability Framework",
      version: "1.0.0",
      description: "Middleware layer for government service integration",
    },
    connectors: health.connectors.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.health.status,
      circuitState: c.health.circuitState,
      failureCount: c.health.failureCount,
      avgLatency: c.health.avgLatency,
      recentRequests: c.health.recentRequests,
    })),
    workflows: health.workflows,
    consent: consentStats,
    notifications: notificationStats,
    dataQuality: {
      status: "active",
      validators: ["aadhaar", "pan", "passport", "business", "driving_license"],
    },
    timestamp: health.timestamp,
  });
}
