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
  Link2,
  Phone,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import AshokaChakra from "@/components/ashoka-chakra";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
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
    { href: "/citizen/journey", label: "My Services", icon: FileText },
    { href: "/citizen/documents", label: "Documents", icon: FolderOpen },
    { href: "/departments", label: "Departments", icon: Building2 },
  ];

  const officerLinks = [
    { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/officer/journeys", label: "Applications", icon: FileText },
    { href: "/officer/health", label: "System Health", icon: Activity },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/interoperability", label: "Framework", icon: Link2 },
    { href: "/admin/journeys", label: "All Journeys", icon: FileText },
    { href: "/admin/services", label: "Services", icon: Settings },
    { href: "/admin/audit", label: "Audit", icon: Shield },
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

      {/* Government Identity Bar */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2">
              <AshokaChakra size={18} />
              <span className="font-semibold tracking-wide">भारत सरकार | Government of India</span>
              <span className="text-blue-300 hidden sm:inline">— MeitY</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-blue-200">
              <Phone className="w-3 h-3" />
              <span className="font-medium text-white">1800-11-0031</span>
              <span className="text-blue-300">Toll Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={user.role === "admin" ? "/admin" : user.role === "officer" ? "/officer" : "/citizen"}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] rounded-lg p-0.5">
              <div className="w-full h-full bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OG</span>
              </div>
            </div>
            <div className="leading-tight">
              <span className="text-xl font-bold text-gray-900">
                ONE<span className="text-[#FF9933]">GOV</span>
              </span>
              <span className="text-[9px] text-gray-400 block">एक सरकार — एक मंच</span>
            </div>
          </Link>

          {/* Desktop Nav — Centered */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && link.href !== "/citizen" && pathname.startsWith(link.href));
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

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Language */}
            <LanguageSwitcher />

            {/* Notifications */}
            <Link
              href="/citizen/notifications"
              className="relative p-1.5 text-gray-400 hover:text-[#FF9933] rounded-md hover:bg-[#FF9933]/10 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF9933] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-[10px] text-gray-500">{user.email}</p>
                      <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#FF9933]/10 text-[#FF9933]">
                        {user.role === "admin" ? "Admin" : user.role === "officer" ? "Officer" : "Citizen"}
                      </span>
                    </div>
                    <Link
                      href="/citizen/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/citizen/notifications"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
              className="md:hidden p-1.5 text-gray-400 hover:text-[#FF9933]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-3 py-2 space-y-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                    isActive ? "bg-[#FF9933]/10 text-[#FF9933]" : "text-gray-600 hover:bg-gray-50"
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
