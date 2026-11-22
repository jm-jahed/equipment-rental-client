"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import {
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface OwnerRentalItem {
  _id: string;
  equipmentId?: {
    _id: string;
    name: string;
    image?: string;
    category: string;
    rentalPrice: number;
    rentalType: string;
  };
  customerId?: {
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
  additionalNotes?: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function OwnerRentalsPage() {
  const [rentals, setRentals] = useState<OwnerRentalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const apiUrl = API_BASE_URL;

  const fetchOwnerRentals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/bookings/owner/my-rentals?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch rentals.");
      }

      setRentals(data.data || []);
    } catch (err: any) {
      console.error("Owner rentals error:", err);
      setErrorMsg(err.message || "Could not load bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerRentals();
  }, [apiUrl]);

  const handleMarkCompleted = async (bookingId: string) => {
    setUpdatingId(bookingId);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to mark booking as completed.");
      }

      setRentals((prev) =>
        prev.map((r) => (r._id === bookingId ? { ...r, bookingStatus: "Completed" } : r))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Owner", "Admin"]}>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Client Machinery Rentals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor client bookings for your listed machinery and mark returned equipment as completed
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading rental reservations...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
        ) : rentals.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No active machinery bookings yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              When clients book your equipment through Stripe Checkout, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Equipment</th>
                    <th className="py-3.5 px-4">Client Contact</th>
                    <th className="py-3.5 px-4">Period & Qty</th>
                    <th className="py-3.5 px-4">Earnings</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Rental Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {rentals.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {r.equipmentId?.image ? (
                            <img
                              src={r.equipmentId.image}
                              alt={r.equipmentId.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold">
                              {r.equipmentId?.name?.charAt(0) || "M"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {r.equipmentId?.name || "Machinery"}
                            </p>
                            <span className="text-[11px] text-slate-400">{r.equipmentId?.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {r.customerId?.name || "Client"}
                        </p>
                        <p className="text-[11px] text-slate-400">{r.contactNumber || r.customerId?.phone}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {r.deliveryAddress}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span>{new Date(r.startDate).toLocaleDateString()}</span>
                          <span className="mx-1 text-slate-400">&rarr;</span>
                          <span>{new Date(r.endDate).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Quantity: {r.quantity}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{r.totalAmount?.toLocaleString()}
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

                      <td className="py-3.5 px-4 text-right">
                        {r.bookingStatus === "Confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={updatingId === r._id}
                            onClick={() => handleMarkCompleted(r._id)}
                            className="text-xs"
                          >
                            {updatingId === r._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                Mark Completed
                              </>
                            )}
                          </Button>
                        )}
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
