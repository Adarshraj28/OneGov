"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  FileText,
  FolderOpen,
  Bell,
  User,
  LogOut,
  Shield,
  Settings,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.push("/login");
      })
      .catch(() => router.push("/login"));

    fetch("/api/notifications?count=true")
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const citizenLinks = [
    { href: "/citizen", label: "Home", icon: Home },
    { href: "/citizen/journey", label: "My Journeys", icon: FileText },
    { href: "/citizen/documents", label: "Documents", icon: FolderOpen },
    { href: "/citizen/profile", label: "Profile", icon: User },
  ];

  const officerLinks = [
    { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/officer/journeys", label: "Applications", icon: FileText },
    { href: "/officer/health", label: "System Health", icon: Activity },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/journeys", label: "All Journeys", icon: FileText },
    { href: "/admin/services", label: "Services", icon: Settings },
    { href: "/admin/simulation", label: "Simulation", icon: Activity },
    { href: "/admin/audit", label: "Audit Logs", icon: Shield },
  ];

  const navLinks =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "officer"
        ? officerLinks
        : citizenLinks;

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Tricolor top accent */}
      <div className="flex h-0.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={user.role === "admin" ? "/admin" : user.role === "officer" ? "/officer" : "/citizen"}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] rounded-lg p-0.5">
                <div className="w-full h-full bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OG</span>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ONE<span className="text-[#FF9933]">GOV</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex ml-8 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#FF9933]/10 text-[#FF9933]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Link
              href="/citizen/notifications"
              className="relative p-2 text-gray-500 hover:text-[#FF9933] rounded-md hover:bg-[#FF9933]/10"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF9933] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Role Badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF9933]/10 text-[#FF9933]">
              {user.role === "admin" ? "Admin" : user.role === "officer" ? "Officer" : "Citizen"}
            </span>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/citizen/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-[#FF9933]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                    isActive
                      ? "bg-[#FF9933]/10 text-[#FF9933]"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
