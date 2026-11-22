"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  condition?: string;
  image: string;
  ownerId?: {
    name: string;
    image?: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CATEGORIES = [
  "All",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["All", "Daily", "Weekly", "Monthly"];

export default function AllEquipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Search and filter states
  const initialCategory = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRentalType, setSelectedRentalType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  // Data states
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Fetch user favorites on load / auth state change
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || localStorage.getItem("token")) : null;
      if (!token || !user) {
        setFavoriteIds([]);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const ids = json.data
              .map((fav: any) =>
                typeof fav.equipmentId === "object" ? fav.equipmentId?._id : fav.equipmentId
              )
              .filter(Boolean);
            setFavoriteIds(ids);
          }
        }
      } catch (err) {
        console.warn("Failed to load favorites:", err);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleToggleFavorite = async (e: React.MouseEvent, equipmentId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const token = typeof window !== "undefined" ? (localStorage.getItem("auth_token") || localStorage.getItem("token")) : null;
    if (!token || !user) {
      router.push("/login?redirect=/equipment");
      return;
    }

    const isFav = favoriteIds.includes(equipmentId);
    // Optimistic state update
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== equipmentId) : [...prev, equipmentId]
    );

    try {
      const res = await fetch(`${API_URL}/favorites/${equipmentId}`, {
        method: isFav ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Revert on error
        setFavoriteIds((prev) =>
          isFav ? [...prev, equipmentId] : prev.filter((id) => id !== equipmentId)
        );
      }
    } catch (err) {
      console.error("Toggle favorite failed:", err);
      // Revert on error
      setFavoriteIds((prev) =>
        isFav ? [...prev, equipmentId] : prev.filter((id) => id !== equipmentId)
      );
    }
  };

  const fetchEquipment = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedRentalType && selectedRentalType !== "All") params.append("rentalType", selectedRentalType);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (availabilityOnly) params.append("availability", "available");
      params.append("sortBy", sortBy);
      params.append("page", String(page));
      params.append("limit", "9");

      const res = await fetch(`${API_URL}/equipment?${params.toString()}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setItems(json.data || []);
        if (json.pagination) {
          setPagination(json.pagination);
        }
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedRentalType, minPrice, maxPrice, availabilityOnly, sortBy, page]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedRentalType("All");
    setMinPrice("");
    setMaxPrice("");
    setAvailabilityOnly(false);
    setSortBy("recent");
    setPage(1);
  };

  const handleViewDetails = (id: string) => {
    if (!user) {
      router.push(`/login?redirect=/equipment/${id}`);
    } else {
      router.push(`/equipment/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Equipment Marketplace
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse All Available Equipment
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Search, filter, and instantly rent professional gear and machinery directly from verified commercial owners.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by equipment name, tool type, or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="recent">Recently Added (Default)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Toggle & Reset */}
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex-1"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              title="Reset all search parameters"
              className="text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>

        {/* Category Pills (Horizontal scrollable) */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Panel (Desktop + Mobile expandable) */}
        <aside
          className={`lg:block ${
            showMobileFilters ? "block" : "hidden"
          } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit space-y-6 shadow-sm`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Filter Equipment
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-500 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Rental Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Rental Period
            </label>
            <div className="space-y-1.5">
              {RENTAL_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rentalType"
                    checked={selectedRentalType === type}
                    onChange={() => {
                      setSelectedRentalType(type);
                      setPage(1);
                    }}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Price Range (৳)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="text-xs"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="text-xs"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => {
                  setAvailabilityOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>In-Stock / Available Only</span>
            </label>
          </div>
        </aside>

        {/* 3-Column Equipment Cards Grid */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div>
            {/* Results count header */}
            <div className="flex items-center justify-between mb-6 text-sm text-slate-500 dark:text-slate-400">
              <p>
                Showing <span className="font-semibold text-slate-900 dark:text-white">{items.length}</span> of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">{pagination.total}</span> items
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse"
                  >
                    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="group flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-amber-500/40 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant="warning" className="bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <Badge variant={item.availableQuantity > 0 ? "success" : "danger"} className="text-xs">
                          {item.availableQuantity > 0 ? `${item.availableQuantity} in stock` : "Out of stock"}
                        </Badge>
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(e, item._id)}
                          className="w-7 h-7 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md group/fav border border-white/20 active:scale-95"
                          title={favoriteIds.includes(item._id) ? "Remove from favorites" : "Add to favorites"}
                          aria-label="Add to favorites"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-colors ${
                              favoriteIds.includes(item._id)
                                ? "fill-red-500 text-red-500"
                                : "text-white group-hover/fav:text-red-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {item.name}
                        </h3>

                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block">Rate</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ৳{item.rentalPrice?.toLocaleString()}
                            <span className="text-xs font-normal text-slate-400">/{item.rentalType?.toLowerCase()}</span>
                          </span>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewDetails(item._id)}
                          className="shadow-sm shadow-amber-500/10"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching equipment found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  We couldn&apos;t find any equipment matching your active filters. Try adjusting your search keywords, price range, or clearing filters.
                </p>
                <Button variant="primary" size="sm" onClick={handleResetFilters} className="mt-6">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1.5">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        page === pNum
                          ? "bg-amber-500 text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
