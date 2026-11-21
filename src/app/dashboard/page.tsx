"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Package,
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface RentalItem {
  _id: string;
  equipmentId?: {
    _id: string;
    name: string;
    image?: string;
    category: string;
    rentalPrice: number;
    rentalType: string;
    location?: string;
  };
  ownerId?: {
    name: string;
    email: string;
    phone?: string;
  };
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<RentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchRentals = useCallback(async (targetPage: number) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/bookings/my-rentals?page=${targetPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch rental history.");
      }

      setRentals(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalRecords(data.pagination.total || 0);
      }
    } catch (err: any) {
      console.error("Rentals error:", err);
      setErrorMsg(err.message || "Could not load rentals.");
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, limit]);

  useEffect(() => {
    fetchRentals(page);
  }, [page, fetchRentals]);

  // Derived metrics from current page dataset
  const activeRentals = rentals.filter((r) => r.bookingStatus === "Confirmed").length;
  const completedRentals = rentals.filter((r) => r.bookingStatus === "Completed").length;
  const totalSpent = rentals
    .filter((r) => r.paymentStatus === "Paid")
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-sm text-amber-100 max-w-xl">
          Manage your equipment rentals, monitor active machinery reservations, and review past transactions in one place.
        </p>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-amber-500/30">
          <div>
            <span className="text-xs text-amber-200 block">Total Bookings</span>
            <span className="text-2xl font-black">{totalRecords}</span>
          </div>
          <div>
            <span className="text-xs text-amber-200 block">Active On Page</span>
            <span className="text-2xl font-black">{activeRentals}</span>
          </div>
          <div>
            <span className="text-xs text-amber-200 block">Completed On Page</span>
            <span className="text-2xl font-black">{completedRentals}</span>
          </div>
          <div>
            <span className="text-xs text-amber-200 block">Invested (Current)</span>
            <span className="text-2xl font-black">${totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rentals Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rental History</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing paginated records ({totalRecords} total rental bookings)
            </p>
          </div>
          <Link href="/equipment">
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-1.5" />
              Rent More Equipment
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading your rentals (Page {page})...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
        ) : rentals.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No rentals booked yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Find the tools and heavy machinery you need from certified providers across the nation.
            </p>
            <Link href="/equipment">
              <Button variant="primary" size="sm">
                Explore Equipment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Equipment</th>
                    <th className="py-3.5 px-4">Rental Duration</th>
                    <th className="py-3.5 px-4">Qty</th>
                    <th className="py-3.5 px-4">Total Price</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Rental Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {rentals.map((rental) => (
                    <tr key={rental._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      {/* Equipment Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {rental.equipmentId?.image ? (
                            <img
                              src={rental.equipmentId.image}
                              alt={rental.equipmentId.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold">
                              {rental.equipmentId?.name ? rental.equipmentId.name.charAt(0) : "E"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {rental.equipmentId?.name || "Equipment Item"}
                            </p>
                            <span className="text-[11px] text-slate-400 capitalize">
                              {rental.equipmentId?.category || "Equipment"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span>{new Date(rental.startDate).toLocaleDateString()}</span>
                          <span className="mx-1 text-slate-400">&rarr;</span>
                          <span>{new Date(rental.endDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {rental.quantity}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        ${rental.totalAmount?.toLocaleString()}
                      </td>

                      {/* Payment status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={rental.paymentStatus === "Paid" ? "success" : "warning"}>
                          {rental.paymentStatus}
                        </Badge>
                      </td>

                      {/* Booking status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            rental.bookingStatus === "Confirmed"
                              ? "info"
                              : rental.bookingStatus === "Completed"
                              ? "success"
                              : "danger"
                          }
                        >
                          {rental.bookingStatus}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {rental.equipmentId?._id && (
                          <Link href={`/equipment/${rental.equipmentId._id}`}>
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{" "}
                  <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({totalRecords} records)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="h-8 px-2.5 text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    className="h-8 px-2.5 text-xs"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
