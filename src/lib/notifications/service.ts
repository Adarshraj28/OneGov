import { prisma } from "../db";

export type NotificationType = "status_update" | "reminder" | "alert" | "system";

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  });
}

export async function getUserNotifications(userId: string, unreadOnly = false) {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

// ─── Predefined Notification Templates ────────────────────────

export async function notifyJourneyStepUpdate(
  userId: string,
  serviceName: string,
  status: string,
  journeyId: string
) {
  const messages: Record<string, { title: string; message: string }> = {
    submitted: {
      title: `${serviceName} - Application Submitted`,
      message: `Your ${serviceName} application has been submitted successfully.`,
    },
    in_progress: {
      title: `${serviceName} - Under Review`,
      message: `Your ${serviceName} application is now being reviewed.`,
    },
    approved: {
      title: `${serviceName} - Approved`,
      message: `Great news! Your ${serviceName} application has been approved.`,
    },
    rejected: {
      title: `${serviceName} - Rejected`,
      message: `Your ${serviceName} application has been rejected. Please check details.`,
    },
    failed: {
      title: `${serviceName} - Service Unavailable`,
      message: `The ${serviceName} service is temporarily unavailable. Your request has been saved and will retry automatically.`,
    },
    waiting: {
      title: `${serviceName} - Waiting for Dependencies`,
      message: `Your ${serviceName} application is waiting for prerequisite services to complete.`,
    },
  };

  const template = messages[status] || {
    title: `${serviceName} - Status Update`,
    message: `Your ${serviceName} application status has been updated to ${status}.`,
  };

  return createNotification(userId, "status_update", template.title, template.message, `/citizen/journey/${journeyId}`);
}

export async function notifyServiceOffline(
  userId: string,
  serviceName: string
) {
  return createNotification(
    userId,
    "alert",
    `Service Temporarily Unavailable`,
    `${serviceName} is currently offline. Your request has been safely saved and will resume when the service is available.`,
  );
}
