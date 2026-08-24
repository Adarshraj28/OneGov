"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import {
  Bell,
  BellOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Loader2,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === "unread" ? "?unread=true" : "";
      const res = await fetch(`/api/notifications${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    fetchNotifications();
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    fetchNotifications();
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "status_update":
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Unread
              </button>
            </div>
            <button
              onClick={markAllRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark all read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <BellOff className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-colors ${
                  n.read
                    ? "border-gray-200"
                    : "border-blue-200 bg-blue-50/30 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {typeIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
