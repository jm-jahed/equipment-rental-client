"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import {
  Package,
  DollarSign,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Loader2,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface OwnerAnalyticsData {
  equipment: {
    total: number;
    approved: number;
    pending: number;
  };
  rentals: {
    total: number;
    active: number;
    completed: number;
  };
  earnings: {
    total: number;
  };
  monthlyStats: {
    month: string;
    earnings: number;
    rentals: number;
  }[];
}

export default function OwnerOverviewPage() {
  const [data, setData] = useState<OwnerAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/analytics/owner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load owner analytics.");
        }

        setData(json.data);
      } catch (err: any) {
        console.error("Owner analytics error:", err);
        setErrorMsg(err.message || "Could not load owner metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [apiUrl]);

  return (
    <ProtectedRoute allowedRoles={["Owner", "Admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Owner Analytics & Fleet Overview
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track machinery performance, earnings, and rental volume
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/owner/add-equipment">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Add Equipment
              </Button>
            </Link>
            <Link href="/dashboard/owner/my-equipment">
              <Button variant="outline" size="sm">
                <Package className="w-4 h-4 mr-1.5" />
                Fleet Catalog
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Calculating fleet analytics...</p>
          </div>
        ) : errorMsg || !data ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg || "No analytics data available."}</div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Listed */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Machinery Listed</span>
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

              {/* Card 2: Active Rentals */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Rentals</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {data.rentals.active}
                </div>
                <p className="text-[11px] text-slate-400">
                  Currently in progress
                </p>
              </div>

              {/* Card 3: Completed Rentals */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {data.rentals.completed}
                </div>
                <p className="text-[11px] text-slate-400">
                  {data.rentals.total} Total Lifetime Bookings
                </p>
              </div>

              {/* Card 4: Total Earnings */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Net Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${data.earnings.total.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  Processed securely via Stripe
                </p>
              </div>
            </div>

            {/* Monthly Earnings & Bookings Bar Representation */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Monthly Earnings & Volume (Challenge 3)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated earnings from verified client bookings over recent months
                  </p>
                </div>
              </div>

              {data.monthlyStats.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No monthly rental activity recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.monthlyStats.map((item, idx) => {
                    const maxEarnings = Math.max(...data.monthlyStats.map((m) => m.earnings), 1);
                    const pct = Math.round((item.earnings / maxEarnings) * 100);

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.month}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {item.rentals} rental{item.rentals === 1 ? "" : "s"} &bull;{" "}
                            <strong className="text-amber-600 dark:text-amber-400">${item.earnings.toLocaleString()}</strong>
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Links Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/owner/my-equipment"
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Manage My Machinery
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update listings, adjust rates, or delete outdated equipment
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>

              <Link
                href="/dashboard/owner/rentals"
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    View Rental Inquiries
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Check client reservation schedules, delivery addresses, and status
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
