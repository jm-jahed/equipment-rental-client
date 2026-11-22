"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface AdminRentalBooking {
  _id: string;
  equipmentId?: {
    name: string;
    category: string;
    rentalPrice: number;
  };
  customerId?: {
    name: string;
    email: string;
    phone?: string;
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
  contactNumber: string;
  deliveryAddress: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function AdminAllRentalsPage() {
  const [rentals, setRentals] = useState<AdminRentalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const apiUrl = API_BASE_URL;

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/bookings/admin/all?limit=50`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch platform rentals.");
        }

        setRentals(data.data || []);
      } catch (err: any) {
        console.error("Admin rentals error:", err);
        setErrorMsg(err.message || "Could not load rentals.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBookings();
  }, [apiUrl]);

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            All Platform Rental Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit and monitor all equipment transactions, customer bookings, and payout status across RentEquip
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading platform bookings...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
        ) : rentals.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            No bookings recorded yet.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Equipment</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Owner</th>
                    <th className="py-3.5 px-4">Rental Dates</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {rentals.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                        #{r._id.slice(-6)}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {r.equipmentId?.name || "Equipment"}
                        </p>
                        <span className="text-[10px] text-slate-400">{r.equipmentId?.category} &bull; Qty: {r.quantity}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {r.customerId?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-400">{r.customerId?.email}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {r.ownerId?.name || "Owner"}
                        </p>
                        <p className="text-[11px] text-slate-400">{r.ownerId?.email}</p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span>{new Date(r.startDate).toLocaleDateString()}</span>
                        <span className="mx-1 text-slate-400">&rarr;</span>
                        <span>{new Date(r.endDate).toLocaleDateString()}</span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        ${r.totalAmount?.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={r.paymentStatus === "Paid" ? "success" : "warning"}>
                          {r.paymentStatus}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            r.bookingStatus === "Confirmed"
                              ? "info"
                              : r.bookingStatus === "Completed"
                              ? "success"
                              : "danger"
                          }
                        >
                          {r.bookingStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
