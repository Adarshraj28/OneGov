import { prisma } from "../db";

export interface AuditMetadata {
  [key: string]: unknown;
}

export async function logAuditEvent(
  userId: string | null,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: AuditMetadata,
  ipAddress?: string
) {
  return prisma.auditLog.create({
    data: {
      userId: userId || undefined,
      action,
      resource,
      resourceId,
      metadata: metadata ? JSON.stringify(metadata) : "{}",
      ipAddress,
    },
  });
}

export async function getAuditLogs(params: {
  userId?: string;
  resource?: string;
  action?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, resource, action, page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  if (resource) where.resource = resource;
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Convenience audit actions
export const AuditActions = {
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  JOURNEY_CREATED: "journey.created",
  JOURNEY_STEP_SUBMITTED: "journey.step.submitted",
  JOURNEY_STEP_COMPLETED: "journey.step.completed",
  JOURNEY_STEP_FAILED: "journey.step.failed",
  CONSENT_GRANTED: "consent.granted",
  CONSENT_REVOKED: "consent.revoked",
  DOCUMENT_UPLOADED: "document.uploaded",
  DOCUMENT_VERIFIED: "document.verified",
  SERVICE_CREATED: "service.created",
  SERVICE_UPDATED: "service.updated",
  INTEGRATION_REQUEST: "integration.request",
  INTEGRATION_FAILED: "integration.failed",
  SYSTEM_CONFIG_CHANGED: "system.config.changed",
  SIMULATION_TOGGLED: "simulation.toggled",
} as const;
