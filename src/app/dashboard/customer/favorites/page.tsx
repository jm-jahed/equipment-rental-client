"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Heart,
  Trash2,
  ExternalLink,
  MapPin,
  Loader2,
  ArrowRight,
  Package,
} from "lucide-react";

interface FavoriteItem {
  _id: string;
  equipmentId?: {
    _id: string;
    name: string;
    description: string;
    category: string;
    rentalPrice: number;
    rentalType: string;
    condition: string;
    location: string;
    image: string;
    availableQuantity: number;
    status: string;
  };
  createdAt: string;
}

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load favorites.");
      }

      setFavorites(data.data || []);
    } catch (err: any) {
      console.error("Favorites error:", err);
      setErrorMsg(err.message || "Could not fetch saved favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [apiUrl]);

  const handleRemove = async (equipmentId: string) => {
    setActionId(equipmentId);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/favorites/${equipmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.equipmentId?._id !== equipmentId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Saved Equipment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookmark items you plan to rent for upcoming projects
          </p>
        </div>
        <Link href="/equipment">
          <Button variant="outline" size="sm">
            <Package className="w-4 h-4 mr-1.5" />
            Explore More
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your saved equipment...</p>
        </div>
      ) : errorMsg ? (
        <div className="py-12 text-center text-xs text-rose-500">{errorMsg}</div>
      ) : favorites.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No saved favorites yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Browse our catalog and tap the heart icon on any equipment to save it here for quick booking.
          </p>
          <Link href="/equipment">
            <Button variant="primary" size="sm">
              Browse Equipment Catalog
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const eq = fav.equipmentId;
            if (!eq) return null;

            return (
              <div
                key={fav._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                  {eq.image ? (
                    <img
                      src={eq.image}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                      {eq.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500 text-slate-950">
                    {eq.category}
                  </span>
                  <button
                    onClick={() => handleRemove(eq._id)}
                    disabled={actionId === eq._id}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-sm transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    {actionId === eq._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {eq.name}
                    </h3>
                    <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" />
                      <span className="truncate">{eq.location}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rate</span>
                      <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                        ${eq.rentalPrice}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          /{eq.rentalType.toLowerCase()}
                        </span>
                      </span>
                    </div>

                    <Link href={`/equipment/${eq._id}`}>
                      <Button variant="primary" size="sm">
                        View Details
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
