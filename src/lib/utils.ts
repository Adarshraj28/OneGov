import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateApplicationId(prefix: string): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${num}`;
}

export function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    approved: "text-green-600 bg-green-50",
    completed: "text-green-600 bg-green-50",
    success: "text-green-600 bg-green-50",
    online: "text-green-600 bg-green-50",
    healthy: "text-green-600 bg-green-50",
    submitted: "text-blue-600 bg-blue-50",
    in_progress: "text-blue-600 bg-blue-50",
    reviewing: "text-amber-600 bg-amber-50",
    pending: "text-amber-600 bg-amber-50",
    waiting: "text-gray-600 bg-gray-50",
    created: "text-gray-600 bg-gray-50",
    degraded: "text-amber-600 bg-amber-50",
    rejected: "text-red-600 bg-red-50",
    failed: "text-red-600 bg-red-50",
    offline: "text-red-600 bg-red-50",
    timeout: "text-red-600 bg-red-50",
    cancelled: "text-gray-600 bg-gray-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
}

export function getStatusDot(status: string): string {
  const colors: Record<string, string> = {
    approved: "bg-green-500",
    completed: "bg-green-500",
    success: "bg-green-500",
    online: "bg-green-500",
    healthy: "bg-green-500",
    submitted: "bg-blue-500",
    in_progress: "bg-blue-500",
    reviewing: "bg-amber-500",
    pending: "bg-amber-500",
    waiting: "bg-gray-400",
    created: "bg-gray-400",
    degraded: "bg-amber-500",
    rejected: "bg-red-500",
    failed: "bg-red-500",
    offline: "bg-red-500",
    timeout: "bg-red-500",
  };
  return colors[status] || "bg-gray-400";
}
