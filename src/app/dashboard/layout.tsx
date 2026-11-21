"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Heart,
  PlusCircle,
  Package,
  Users,
  ShieldCheck,
  User,
  LayoutDashboard,
  BarChart3,
  Layers,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6 sticky top-24">
                {/* User mini profile */}
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-base overflow-hidden">
                    {user?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <Badge variant="warning" className="mt-1 text-[10px]">
                      {user?.role} Portal
                    </Badge>
                  </div>
                </div>

                {/* Role Specific Nav Items */}
                <nav className="space-y-1">
                  {/* Customer Links */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Customer Menu
                  </div>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/dashboard" || pathname === "/dashboard/customer/rentals"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    My Rentals
                  </Link>

                  <Link
                    href="/dashboard/customer/favorites"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/dashboard/customer/favorites"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Heart className="w-4 h-4 shrink-0" />
                    Saved Favorites
                  </Link>

                  {/* Owner Links (Shown if Owner or Admin) */}
                  {(user?.role === "Owner" || user?.role === "Admin") && (
                    <>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 pt-4">
                        Owner Operations
                      </div>
                      <Link
                        href="/dashboard/owner"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/owner"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <BarChart3 className="w-4 h-4 shrink-0" />
                        Owner Analytics
                      </Link>
                      <Link
                        href="/dashboard/owner/add-equipment"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/owner/add-equipment"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <PlusCircle className="w-4 h-4 shrink-0" />
                        Add Equipment
                      </Link>
                      <Link
                        href="/dashboard/owner/my-equipment"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/owner/my-equipment"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Package className="w-4 h-4 shrink-0" />
                        My Equipment
                      </Link>
                      <Link
                        href="/dashboard/owner/rentals"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/owner/rentals"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Layers className="w-4 h-4 shrink-0" />
                        Owner Rentals
                      </Link>
                    </>
                  )}

                  {/* Admin Links */}
                  {user?.role === "Admin" && (
                    <>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 pt-4">
                        Administration
                      </div>
                      <Link
                        href="/dashboard/admin"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/admin"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        Admin Analytics
                      </Link>
                      <Link
                        href="/dashboard/admin/users"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/admin/users"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Users className="w-4 h-4 shrink-0" />
                        Manage Users
                      </Link>
                      <Link
                        href="/dashboard/admin/equipment"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/admin/equipment"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        Manage Equipment
                      </Link>
                      <Link
                        href="/dashboard/admin/rentals"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/dashboard/admin/rentals"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Calendar className="w-4 h-4 shrink-0" />
                        All Rentals
                      </Link>
                    </>
                  )}

                  {/* General Profile Link */}
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 pt-4">
                    Account
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/dashboard/profile"
                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    Profile Settings
                  </Link>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-9">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
