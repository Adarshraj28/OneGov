// ─── Event-Driven Notification System ──────────────────────────
// Real-time notifications via Server-Sent Events (SSE)

export type NotificationEvent =
  | "journey.created"
  | "journey.step.submitted"
  | "journey.step.approved"
  | "journey.step.rejected"
  | "journey.step.failed"
  | "journey.completed"
  | "consent.requested"
  | "consent.approved"
  | "consent.revoked"
  | "service.offline"
  | "service.recovered"
  | "document.required"
  | "document.verified";

export interface NotificationPayload {
  id: string;
  event: NotificationEvent;
  userId: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface NotificationSubscription {
  userId: string;
  events: NotificationEvent[];
  callback: (notification: NotificationPayload) => void;
}

// ─── Notification Templates ────────────────────────────────────

export const NOTIFICATION_TEMPLATES: Record<
  NotificationEvent,
  (data: Record<string, string>) => { title: string; message: string }
> = {
  "journey.created": (data) => ({
    title: `Service Journey Started`,
    message: `Your journey for "${data.intent}" has been created with ${data.serviceCount} services.`,
  }),
  "journey.step.submitted": (data) => ({
    title: `${data.serviceName} - Application Submitted`,
    message: `Your ${data.serviceName} application has been submitted successfully. Application ID: ${data.applicationId}`,
  }),
  "journey.step.approved": (data) => ({
    title: `${data.serviceName} - Approved ✅`,
    message: `Great news! Your ${data.serviceName} application has been approved.`,
  }),
  "journey.step.rejected": (data) => ({
    title: `${data.serviceName} - Rejected ❌`,
    message: `Your ${data.serviceName} application has been rejected. Please check details.`,
  }),
  "journey.step.failed": (data) => ({
    title: `${data.serviceName} - Service Unavailable ⚠️`,
    message: `The ${data.serviceName} service is temporarily unavailable. Your request will retry automatically.`,
  }),
  "journey.completed": (data) => ({
    title: `Journey Completed 🎉`,
    message: `Congratulations! Your "${data.intent}" journey has been completed successfully.`,
  }),
  "consent.requested": (data) => ({
    title: `Consent Required`,
    message: `${data.department} is requesting access to your ${data.fields} for ${data.purpose}.`,
  }),
  "consent.approved": (data) => ({
    title: `Consent Approved`,
    message: `You have approved data sharing with ${data.department}.`,
  }),
  "consent.revoked": (data) => ({
    title: `Consent Revoked`,
    message: `Data sharing consent with ${data.department} has been revoked.`,
  }),
  "service.offline": (data) => ({
    title: `Service Offline - ${data.serviceName}`,
    message: `${data.serviceName} is currently offline. Requests will be queued.`,
  }),
  "service.recovered": (data) => ({
    title: `Service Recovered - ${data.serviceName}`,
    message: `${data.serviceName} is back online. Queued requests are being processed.`,
  }),
  "document.required": (data) => ({
    title: `Document Required`,
    message: `Please upload ${data.documentName} for ${data.serviceName}.`,
  }),
  "document.verified": (data) => ({
    title: `Document Verified`,
    message: `Your ${data.documentName} has been verified successfully.`,
  }),
};

// ─── Notification Manager ──────────────────────────────────────

export class NotificationManager {
  private notifications: Map<string, NotificationPayload[]> = new Map();
  private subscriptions: Map<string, NotificationSubscription[]> = new Map();
  private eventIdCounter = 0;

  constructor() {
    this.initializeDefaultNotifications();
  }

  private initializeDefaultNotifications() {
    const defaultNotifications: NotificationPayload[] = [
      {
        id: "notif-1",
        event: "journey.step.approved",
        userId: "citizen-001",
        title: "Business Registration - Approved ✅",
        message:
          "Your business registration has been approved. Application ID: BR-2026-10291",
        timestamp: "2026-08-20T10:00:00Z",
        read: false,
        priority: "high",
      },
      {
        id: "notif-2",
        event: "journey.step.submitted",
        userId: "citizen-001",
        title: "Food License - Under Review",
        message:
          "Your FSSAI application is being reviewed by the department.",
        timestamp: "2026-08-21T14:30:00Z",
        read: false,
        priority: "medium",
      },
      {
        id: "notif-3",
        event: "service.offline",
        userId: "citizen-001",
        title: "Service Temporarily Unavailable",
        message:
          "Fire Safety service is temporarily offline. Your request will retry automatically.",
        timestamp: "2026-08-19T09:00:00Z",
        read: true,
        priority: "urgent",
      },
      {
        id: "notif-4",
        event: "consent.requested",
        userId: "citizen-002",
        title: "Consent Required - Aadhaar Verification",
        message:
          "Income Tax Department is requesting access to your Aadhaar details for PAN application.",
        timestamp: "2026-08-22T11:00:00Z",
        read: false,
        priority: "high",
      },
      {
        id: "notif-5",
        event: "journey.completed",
        userId: "citizen-001",
        title: "Journey Completed 🎉",
        message:
          'Congratulations! Your "Open restaurant in Pune" journey has been completed.',
        timestamp: "2026-08-15T16:00:00Z",
        read: true,
        priority: "medium",
      },
    ];

    defaultNotifications.forEach((notif) => {
      const userNotifs = this.notifications.get(notif.userId) || [];
      userNotifs.push(notif);
      this.notifications.set(notif.userId, userNotifs);
    });
  }

  // Send notification
  sendNotification(
    event: NotificationEvent,
    userId: string,
    data: Record<string, string> = {}
  ): NotificationPayload {
    const template = NOTIFICATION_TEMPLATES[event];
    const { title, message } = template(data);

    const notification: NotificationPayload = {
      id: `notif-${++this.eventIdCounter}-${Date.now()}`,
      event,
      userId,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
      priority: this.getPriority(event),
    };

    // Store notification
    const userNotifs = this.notifications.get(userId) || [];
    userNotifs.unshift(notification);
    this.notifications.set(userId, userNotifs);

    // Notify subscribers
    const userSubscriptions = this.subscriptions.get(userId) || [];
    userSubscriptions.forEach((sub) => {
      if (sub.events.includes(event)) {
        sub.callback(notification);
      }
    });

    return notification;
  }

  // Get priority for event type
  private getPriority(
    event: NotificationEvent
  ): "low" | "medium" | "high" | "urgent" {
    const priorityMap: Record<NotificationEvent, "low" | "medium" | "high" | "urgent"> = {
      "journey.created": "low",
      "journey.step.submitted": "medium",
      "journey.step.approved": "high",
      "journey.step.rejected": "high",
      "journey.step.failed": "urgent",
      "journey.completed": "medium",
      "consent.requested": "high",
      "consent.approved": "low",
      "consent.revoked": "medium",
      "service.offline": "urgent",
      "service.recovered": "medium",
      "document.required": "high",
      "document.verified": "low",
    };
    return priorityMap[event] || "medium";
  }

  // Get user notifications
  getUserNotifications(
    userId: string,
    unreadOnly = false
  ): NotificationPayload[] {
    const userNotifs = this.notifications.get(userId) || [];
    if (unreadOnly) {
      return userNotifs.filter((n) => !n.read);
    }
    return userNotifs;
  }

  // Get unread count
  getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId, true).length;
  }

  // Mark as read
  markAsRead(notificationId: string, userId: string): boolean {
    const userNotifs = this.notifications.get(userId) || [];
    const notif = userNotifs.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  // Mark all as read
  markAllAsRead(userId: string): number {
    const userNotifs = this.notifications.get(userId) || [];
    let count = 0;
    userNotifs.forEach((n) => {
      if (!n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  }

  // Subscribe to events
  subscribe(subscription: NotificationSubscription): void {
    const userSubs = this.subscriptions.get(subscription.userId) || [];
    userSubs.push(subscription);
    this.subscriptions.set(subscription.userId, userSubs);
  }

  // Unsubscribe
  unsubscribe(userId: string): void {
    this.subscriptions.delete(userId);
  }
}
