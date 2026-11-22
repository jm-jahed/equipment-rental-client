"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { BookingModal } from "@/components/booking/BookingModal";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface EquipmentDetail {
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
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
  };
  createdAt?: string;
}

export default function EquipmentDetailPage({ params }: { params?: { id: string } }) {
  const { user } = useAuth();
  const routerParams = useParams();
  const equipmentId = (routerParams?.id as string) || (params as any)?.id || "";

  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const apiUrl = API_BASE_URL;

  useEffect(() => {
    const fetchEquipmentAndFav = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Fetch equipment details (Protected route)
        const eqRes = await fetch(`${apiUrl}/api/equipment/${equipmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!eqRes.ok) {
          if (eqRes.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("auth_token");
            const redirectTarget = typeof window !== "undefined" ? window.location.pathname : `/equipment/${equipmentId}`;
            window.location.href = `/login?redirect=${encodeURIComponent(redirectTarget)}`;
            return;
          }
          const errData = await eqRes.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to load equipment details.");
        }

        const eqData = await eqRes.json();
        setEquipment(eqData.data);

        // Fetch favorite check
        try {
          const favRes = await fetch(`${apiUrl}/api/favorites/check/${equipmentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            setIsFavorite(favData.isFavorite);
          }
        } catch (favErr) {
          console.warn("Could not check favorite status:", favErr);
        }
      } catch (err: any) {
        console.error("Error loading equipment:", err);
        setErrorMsg(err.message || "Failed to load equipment details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (equipmentId) {
      fetchEquipmentAndFav();
    }
  }, [equipmentId, apiUrl]);

  const toggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const method = isFavorite ? "DELETE" : "POST";
      const res = await fetch(`${apiUrl}/api/favorites/${equipmentId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb / Back button with role awareness */}
          <div className="flex items-center justify-between">
            {user?.role === "Admin" ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link
                  href="/dashboard/admin/equipment"
                  className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to Admin Equipment
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/dashboard/admin"
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Admin Dashboard
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/equipment"
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Public Catalog
                </Link>
              </div>
            ) : user?.role === "Owner" ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Link
                  href="/dashboard/owner/my-equipment"
                  className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to My Equipment
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/equipment"
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Public Catalog
                </Link>
              </div>
            ) : (
              <Link
                href="/equipment"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Catalog
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading equipment details...</p>
            </div>
          ) : errorMsg || !equipment ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to View Equipment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{errorMsg || "Equipment not found or removed."}</p>
              <Link href={user?.role === "Admin" ? "/dashboard/admin/equipment" : user?.role === "Owner" ? "/dashboard/owner/my-equipment" : "/equipment"}>
                <Button variant="primary">
                  {user?.role === "Admin"
                    ? "Return to Admin Equipment"
                    : user?.role === "Owner"
                    ? "Return to My Equipment"
                    : "Return to Equipment Catalog"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Image and Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {equipment.image ? (
                    <img
                      src={equipment.image}
                      alt={equipment.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Layers className="w-16 h-16 stroke-1 mb-2" />
                      <span className="text-sm">No photo available</span>
                    </div>
                  )}

                  {/* Favorite button float */}
                  <button
                    onClick={toggleFavorite}
                    disabled={favLoading}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-500 transition-all cursor-pointer"
                    title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-sm">
                      {equipment.category}
                    </span>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Description & Specifications</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {equipment.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Condition</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{equipment.condition}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Rental Frequency</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{equipment.rentalType}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Stock Remaining</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {equipment.availableQuantity > 0 ? `${equipment.availableQuantity} units` : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Booking CTA & Owner Details */}
              <div className="lg:col-span-5 space-y-6">
                {/* Booking & Pricing Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={equipment.availableQuantity > 0 ? "success" : "danger"}>
                        {equipment.availableQuantity > 0 ? "Available for Rent" : "Currently Unavailable"}
                      </Badge>
                      <Badge variant="info">{equipment.condition} Condition</Badge>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{equipment.name}</h1>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <MapPin className="w-4 h-4 mr-1 text-amber-500 shrink-0" />
                      <span>{equipment.location}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Rental Rate</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                        ৳{equipment.rentalPrice?.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        / {equipment.rentalType?.toLowerCase() || "daily"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      className="w-full py-3.5 text-base font-bold shadow-md shadow-amber-500/10"
                      disabled={equipment.availableQuantity === 0}
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {equipment.availableQuantity > 0 ? "Book Now with Stripe" : "Currently Out of Stock"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={toggleFavorite}
                      disabled={favLoading}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                      {isFavorite ? "Saved in Your Favorites" : "Add to Favorites"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified machinery &bull; Secure Stripe payment protection</span>
                  </div>
                </div>

                {/* Owner Information Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Equipment Owner
                  </h3>

                  {equipment.ownerId ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {equipment.ownerId.image ? (
                          <img
                            src={equipment.ownerId.image}
                            alt={equipment.ownerId.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <UserIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {equipment.ownerId.name}
                          </h4>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Provider
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{equipment.ownerId.email}</span>
                        </div>
                        {equipment.ownerId.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{equipment.ownerId.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Contact information provided upon rental confirmation.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Modal */}
          {equipment && (
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              equipment={{
                _id: equipment._id,
                name: equipment.name,
                rentalPrice: equipment.rentalPrice,
                rentalType: equipment.rentalType,
                availableQuantity: equipment.availableQuantity,
                image: equipment.image,
                location: equipment.location,
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
