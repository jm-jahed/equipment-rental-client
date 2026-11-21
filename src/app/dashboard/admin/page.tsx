"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Package,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Loader2,
  ArrowRight,
  PieChart,
} from "lucide-react";

interface AdminAnalyticsData {
  users: {
    total: number;
    customers: number;
    owners: number;
    admins: number;
  };
  equipment: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    categoryBreakdown: { category: string; count: number }[];
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
  };
  monthlyStats: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
}

export default function AdminAnalyticsOverviewPage() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/analytics/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load admin analytics.");
        }

        setData(json.data);
      } catch (err: any) {
        console.error("Admin analytics error:", err);
        setErrorMsg(err.message || "Could not load platform metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [apiUrl]);

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Platform Administration & Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time platform metrics, user management, and transactional insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-1.5" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/equipment">
              <Button variant="primary" size="sm">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Approve Equipment
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Aggregating platform database metrics...</p>
          </div>
        ) : errorMsg || !data ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg || "Analytics unavailable."}</div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Users */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {data.users.total}
                </div>
                <p className="text-[11px] text-slate-400">
                  {data.users.customers} Customers &bull; {data.users.owners} Owners &bull; {data.users.admins} Admins
                </p>
              </div>

              {/* Card 2: Equipment */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Equipment</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {data.equipment.total}
                </div>
                <p className="text-[11px] text-slate-400">
                  {data.equipment.approved} Approved &bull; {data.equipment.pending} Pending
                </p>
              </div>

              {/* Card 3: Bookings */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Rentals</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {data.bookings.total}
                </div>
                <p className="text-[11px] text-slate-400">
                  {data.bookings.confirmed} Active &bull; {data.bookings.completed} Completed
                </p>
              </div>

              {/* Card 4: Platform Revenue */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${data.revenue.total.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculated dynamically from paid bookings
                </p>
              </div>
            </div>

            {/* Monthly Statistics & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Monthly Revenue & Rentals (Challenge 3) */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Monthly Revenue & Activity (Challenge 3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dynamic aggregation of platform volume across recent months
                  </p>
                </div>

                {data.monthlyStats.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No monthly rental data available yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.monthlyStats.map((item, idx) => {
                      const maxRev = Math.max(...data.monthlyStats.map((m) => m.revenue), 1);
                      const pct = Math.round((item.revenue / maxRev) * 100);

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.month}</span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {item.bookings} booking{item.bookings === 1 ? "" : "s"} &bull;{" "}
                              <strong className="text-emerald-600 dark:text-emerald-400">${item.revenue.toLocaleString()}</strong>
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${Math.max(5, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: Category Distribution */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-amber-500" />
                    Equipment Categories
                  </h3>
                  <p className="text-xs text-slate-500">Inventory distribution across sectors</p>
                </div>

                <div className="space-y-3 pt-2">
                  {data.equipment.categoryBreakdown.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {cat.category}
                      </span>
                      <Badge variant="warning">{cat.count} units</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Management Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/dashboard/admin/users"
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Manage Platform Users
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust roles (Customer / Owner / Admin) or remove accounts
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                href="/dashboard/admin/equipment"
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Approve Machinery
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Approve or reject newly submitted equipment listings
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                href="/dashboard/admin/rentals"
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    All Platform Bookings
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspect all rental transactions, customer notes, and statuses
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
