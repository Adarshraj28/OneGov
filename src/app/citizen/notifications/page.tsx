"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import GovFooter from "@/components/gov-footer";
import {
  Bell,
  BellOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Loader2,
  Shield,
  Globe,
  FileText,
  CreditCard,
  Building2,
  Fingerprint,
  MapPin,
  ExternalLink,
  Filter,
  RefreshCw,
  Zap,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
  source?: string;
  portal?: string;
  priority?: "high" | "medium" | "low";
}

const PORTAL_NOTIFICATIONS: Array<{
  type: string;
  title: string;
  message: string;
  source: string;
  portal: string;
  priority: "high" | "medium" | "low";
}> = [
  {
    type: "status_update",
    title: "UIDAI System Maintenance",
    message: "Aadhaar verification services will undergo scheduled maintenance on 1 September 2026 (2:00 AM - 6:00 AM IST). Services may be temporarily unavailable.",
    source: "UIDAI",
    portal: "uidai",
    priority: "medium",
  },
  {
    type: "status_update",
    title: "GST Returns Filing Reminder",
    message: "GSTR-1 and GSTR-3B filing deadline for August 2026 is 20 September 2026. File early to avoid late fees.",
    source: "GSTN",
    portal: "gstn",
    priority: "high",
  },
  {
    type: "status_update",
    title: "Passport Seva — New Appointment Slots",
    message: "New passport appointment slots for Pune RPO are now available for the week of 8-12 September 2026.",
    source: "MEA / Passport Seva",
    portal: "mea",
    priority: "medium",
  },
  {
    type: "status_update",
    title: "MCA Company Filing Deadline",
    message: "Annual Return (Form MGT-7) and Financial Statement (Form AOC-4) filing deadline for FY 2025-26 is 30 November 2026.",
    source: "MCA",
    portal: "mca",
    priority: "high",
  },
  {
    type: "status_update",
    title: "Voter ID — Electoral Roll Update",
    message: "Special voter registration drive for citizens turning 18 by 1 January 2027 is now active. Apply through NVSP portal.",
    source: "ECI",
    portal: "eci",
    priority: "medium",
  },
  {
    type: "status_update",
    title: "NSDL PAN Update Service",
    message: "Linking Aadhaar with PAN is mandatory. Visit onlineservices.nsdl.com to complete linking if not already done.",
    source: "NSDL",
    portal: "nsdl",
    priority: "high",
  },
  {
    type: "status_update",
    title: "Parivahan — DL Renewal Online",
    message: "Driving License renewal can now be completed entirely online through Parivahan Sewa. No office visit required for eligible cases.",
    source: "MORTH / Parivahan",
    portal: "morth",
    priority: "low",
  },
  {
    type: "status_update",
    title: "FSSAI License Renewal Alert",
    message: "Food business operators must renew FSSAI license 30 days before expiry. Late renewal attracts penalty of ₹100/day.",
    source: "FSSAI",
    portal: "fssai",
    priority: "high",
  },
];

const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  status_update: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  alert: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  reminder: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  info: { icon: Info, color: "text-gray-600", bg: "bg-gray-50" },
  security: { icon: Shield, color: "text-green-600", bg: "bg-green-50" },
  document: { icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
};

const PORTAL_COLORS: Record<string, string> = {
  uidai: "bg-blue-100 text-blue-700",
  nsdl: "bg-green-100 text-green-700",
  mea: "bg-indigo-100 text-indigo-700",
  morth: "bg-orange-100 text-orange-700",
  eci: "bg-red-100 text-red-700",
  mca: "bg-purple-100 text-purple-700",
  gstn: "bg-teal-100 text-teal-700",
  fssai: "bg-pink-100 text-pink-700",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "portal">("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    if (!loading) setRefreshing(true);
    try {
      const params = filter === "unread" ? "?unread=true" : "";
      const res = await fetch(`/api/notifications${params}`);
      const data = await res.json();
      
      // Merge backend notifications with portal notifications
      const backendNotifs = data.notifications || [];
      const portalNotifs = PORTAL_NOTIFICATIONS.map((pn, i) => ({
        id: `portal-${i}`,
        ...pn,
        read: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      let allNotifs = [...backendNotifs, ...portalNotifs];
      if (filter === "unread") {
        allNotifs = allNotifs.filter((n) => !n.read);
      }
      if (filter === "portal") {
        allNotifs = allNotifs.filter((n) => !!n.portal);
      }

      // Sort by date
      allNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(allNotifs);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markRead = async (id: string) => {
    if (id.startsWith("portal-")) {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      return;
    }
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const portalCount = notifications.filter((n) => !!n.portal).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              सूचनाएँ — Government portal updates &amp; application alerts
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live — Monitoring {Object.keys(PORTAL_COLORS).length} government portals
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("portal")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                filter === "portal" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
            >
              <Globe className="w-3 h-3" />
              Portal Updates ({portalCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#FF9933] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "unread" ? "No unread notifications" : filter === "portal" ? "No portal updates" : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const typeConf = NOTIFICATION_TYPE_CONFIG[n.type] || NOTIFICATION_TYPE_CONFIG.info;
              const TypeIcon = typeConf.icon;
              const portalColor = n.portal ? PORTAL_COLORS[n.portal] : null;
              
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                    n.read
                      ? "border-gray-200"
                      : n.priority === "high"
                        ? "border-red-200 bg-red-50/30 hover:bg-red-50/50"
                        : "border-blue-200 bg-blue-50/30 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeConf.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${typeConf.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        {n.portal && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${portalColor || "bg-gray-100 text-gray-600"}`}>
                            {n.source}
                          </span>
                        )}
                        {n.priority === "high" && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            HIGH
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                        {n.portal && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Globe className="w-3 h-3" />
                            {n.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <GovFooter />
    </div>
  );
}
