"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import {
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface AdminEquipmentItem {
  _id: string;
  name: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  location: string;
  image: string;
  status: "Pending" | "Approved" | "Rejected";
  ownerId?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminManageEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<AdminEquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  // Delete confirmation modal
  const [deletingItem, setDeletingItem] = useState<AdminEquipmentItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = API_BASE_URL;

  const fetchAllEquipment = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/equipment/admin/all?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch platform equipment.");
      }

      setEquipmentList(data.data || []);
    } catch (err: any) {
      console.error("Fetch equipment error:", err);
      setErrorMsg(err.message || "Could not load equipment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEquipment();
  }, [apiUrl]);

  const handleUpdateStatus = async (id: string, status: "Approved" | "Rejected") => {
    setActionId(id);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/equipment/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update equipment status.");
      }

      setEquipmentList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (err: any) {
      alert(err.message || "Status update failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/equipment/${deletingItem._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete equipment.");
      }

      setEquipmentList((prev) => prev.filter((item) => item._id !== deletingItem._id));
      setIsDeleteOpen(false);
    } catch (err: any) {
      alert(err.message || "Deletion failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Manage Platform Equipment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review submitted machinery listings, grant approval for public display, or reject non-compliant items
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading platform equipment...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
        ) : equipmentList.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            No equipment items found.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Equipment</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Owner</th>
                    <th className="py-3.5 px-4">Rate</th>
                    <th className="py-3.5 px-4">Qty</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {equipmentList.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold">
                              {item.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {item.name}
                            </p>
                            <span className="text-[11px] text-slate-400">{item.location}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium">{item.category}</td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.ownerId?.name || "Owner"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {item.ownerId?.email}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        ৳{item.rentalPrice?.toLocaleString()}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          /{item.rentalType.toLowerCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.availableQuantity}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            item.status === "Approved"
                              ? "success"
                              : item.status === "Pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {item.status !== "Approved" && (
                            <button
                              disabled={actionId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "Approved")}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Approve Equipment"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Reject Button */}
                          {item.status !== "Rejected" && (
                            <button
                              disabled={actionId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "Rejected")}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                              title="Reject Equipment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* View link */}
                          <Link href={`/equipment/${item._id}`}>
                            <button
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setDeletingItem(item);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <Modal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            title="Confirm Equipment Deletion"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to permanently delete{" "}
                <strong className="text-slate-900 dark:text-white">{deletingItem.name}</strong> from the platform?
              </p>
              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteEquipment} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ProtectedRoute>
  );
}
