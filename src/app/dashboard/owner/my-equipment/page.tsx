"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { API_BASE_URL } from "@/lib/api";
import {
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  condition: "New" | "Good" | "Fair";
  location: string;
  image: string;
  availableQuantity: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export default function MyEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingItem, setDeletingItem] = useState<EquipmentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = API_BASE_URL;

  const fetchMyEquipment = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/equipment/owner/my-equipment?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch equipment.");
      }

      setEquipmentList(data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setErrorMsg(err.message || "Could not load equipment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEquipment();
  }, [apiUrl]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/equipment/${editingItem._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingItem.name,
          description: editingItem.description,
          rentalPrice: editingItem.rentalPrice,
          rentalType: editingItem.rentalType,
          condition: editingItem.condition,
          location: editingItem.location,
          availableQuantity: editingItem.availableQuantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update equipment.");
      }

      setEquipmentList((prev) =>
        prev.map((item) => (item._id === editingItem._id ? data.data : item))
      );
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
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
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["Owner", "Admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              My Machinery Fleet
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your machinery listings, modify rates, and monitor approval status
            </p>
          </div>
          <Link href="/dashboard/owner/add-equipment">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Equipment
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading your equipment...</p>
          </div>
        ) : errorMsg ? (
          <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
        ) : equipmentList.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No equipment listed yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Start earning by listing your excavators, tractors, or power tools for certified clients.
            </p>
            <Link href="/dashboard/owner/add-equipment">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Add Your First Machinery
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4">Equipment</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Rate</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
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
                            <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {item.name}
                            </p>
                            <span className="text-[11px] text-slate-400">{item.condition} condition</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium">{item.category}</td>

                      <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">
                        ${item.rentalPrice}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          /{item.rentalType.toLowerCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.availableQuantity}
                      </td>

                      <td className="py-3.5 px-4">{item.location}</td>

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
                          <Link href={`/equipment/${item._id}`}>
                            <button
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>

                          <button
                            onClick={() => {
                              setEditingItem({ ...item });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeletingItem(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Listing"
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

        {/* Edit Equipment Modal */}
        {editingItem && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Equipment Details"
          >
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingItem.rentalPrice}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rentalPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={editingItem.rentalType}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rentalType: e.target.value as any })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingItem.availableQuantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        availableQuantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirm Deletion"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to permanently delete{" "}
                <strong className="text-slate-900 dark:text-white">{deletingItem.name}</strong>? This action cannot be undone.
              </p>
              <div className="pt-2 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
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
