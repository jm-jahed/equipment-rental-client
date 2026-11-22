"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Truck,
  HardHat,
  Tractor,
  Cpu,
  CreditCard,
  CalendarRange,
  Star,
  Sparkles,
  MapPin,
  Tag,
  ChevronRight,
  Award,
  Layers,
  Heart,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: string;
  location: string;
  availableQuantity: number;
  image: string;
  ownerId?: {
    name: string;
    image?: string;
  };
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [featuredItems, setFeaturedItems] = useState<EquipmentItem[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

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
      router.push(`/login?redirect=/`);
      return;
    }

    const isFav = favoriteIds.includes(equipmentId);
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== equipmentId) : [...prev, equipmentId]
    );

    try {
      const res = await fetch(`${API_URL}/favorites/${equipmentId}`, {
        method: isFav ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setFavoriteIds((prev) =>
          isFav ? [...prev, equipmentId] : prev.filter((id) => id !== equipmentId)
        );
      }
    } catch (err) {
      console.error("Toggle favorite failed:", err);
      setFavoriteIds((prev) =>
        isFav ? [...prev, equipmentId] : prev.filter((id) => id !== equipmentId)
      );
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/equipment/featured`);
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setFeaturedItems(data.data);
        }
      } catch (error) {
        console.error("Failed to load featured equipment:", error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleViewDetails = (equipmentId: string) => {
    if (!user) {
      router.push(`/login?redirect=/equipment/${equipmentId}`);
    } else {
      router.push(`/equipment/${equipmentId}`);
    }
  };

  // 6 Essential Equipment Categories per Assignment 9 specification
  const categories = [
    {
      name: "Construction Equipment",
      description: "Excavators, compaction rollers, concrete mixers, and heavy earthmoving machines.",
      icon: HardHat,
      count: "4 Listings",
      color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    },
    {
      name: "Photography Equipment",
      description: "Cinema 8K camera packages, motorized gimbal stabilizers, and studio LED lighting.",
      icon: Camera,
      count: "4 Listings",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500",
    },
    {
      name: "Vehicles & Transportation",
      description: "Counterbalance forklifts, rough-terrain telehandlers, and electric pallet stackers.",
      icon: Truck,
      count: "4 Listings",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    },
    {
      name: "Agriculture Equipment",
      description: "4WD farm tractors, combine paddy harvesters, power tillers, and rotary cutters.",
      icon: Tractor,
      count: "4 Listings",
      color: "from-green-500/20 to-lime-500/20 text-green-500",
    },
    {
      name: "Electronics",
      description: "Industrial diesel generators, quiet inverter units, and commercial power systems.",
      icon: Cpu,
      count: "4 Listings",
      color: "from-purple-500/20 to-violet-500/20 text-purple-500",
    },
    {
      name: "Event Equipment",
      description: "Concert line array audio rigs, outdoor stage truss canopies, and moving head lights.",
      icon: Sparkles,
      count: "4 Listings",
      color: "from-pink-500/20 to-rose-500/20 text-pink-500",
    },
  ];

  // Verified Customer Reviews per Assignment 9 (at least 4 with Bangladeshi localization)
  const reviews = [
    {
      id: 1,
      name: "Mohammad Rahman",
      role: "Lead Construction Project Manager",
      company: "Apex Infrastructure Group, Dhaka",
      rating: 5,
      comment:
        "Renting a 20-ton CAT excavator for our highway expansion project in Dhaka was completely seamless. The machine arrived on schedule, in immaculate condition, and the transparent BDT invoicing gave our accounting team complete peace of mind.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      role: "Director of Photography",
      company: "Velvet Horizon Studios, Chattogram",
      rating: 5,
      comment:
        "We needed specialized 8K cinema packages for a 10-day commercial shoot in Chattogram. Finding verified owners with insured equipment saved our production schedule. The digital contracts and instant Stripe checkout were top-notch.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Tanvir Ahmed",
      role: "Independent Fleet Owner",
      company: "Ahmed Earthworks & Machinery, Gazipur",
      rating: 5,
      comment:
        "Listing idle excavators and forklifts on RentEquip has generated consistent rental revenue for our business. The verified renter verification, security deposit guarantee, and direct BDT payouts make this platform our first choice.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Farhana Akter",
      role: "Production & Event Logistics Director",
      company: "Green Bengal Events & Media, Sylhet",
      rating: 5,
      comment:
        "From soundproof diesel generators to concert line array sound rigs, RentEquip is our trusted rental partner in Bangladesh. Real-time availability checks prevent last-minute festival shortages and the owner communication was seamless.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-24 pb-20">
      {/* =========================================================================
          SECTION 1: HERO BANNER (Framer Motion Animation per Requirement 161)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-28 lg:pt-32 lg:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Verified Industrial & Commercial Rental Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight"
          >
            Rent Heavy Machinery & Professional Tools with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Complete Trust
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            RentEquip links commercial equipment owners directly with licensed contractors, cinematographers, and event producers. Transparent pricing, verified owner profiles, and instant Stripe payments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/all-equipment">
              <Button size="lg" variant="primary" className="h-13 px-8 text-base shadow-xl shadow-amber-500/20">
                Explore All Equipment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href={user ? (user.role === "Owner" ? "/dashboard/owner/add" : "/dashboard") : "/register"}>
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-slate-700 text-slate-200 hover:bg-slate-800">
                List Your Equipment
              </Button>
            </Link>
          </motion.div>

          {/* Key Platform Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Verified Owners</p>
                <p className="text-xs text-slate-400">100% vetted profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Flexible Rental</p>
                <p className="text-xs text-slate-400">Daily, weekly, monthly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Secure Stripe Pay</p>
                <p className="text-xs text-slate-400">End-to-end encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Direct Delivery</p>
                <p className="text-xs text-slate-400">To your project site</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED EQUIPMENT (Exactly 6 Approved Items via MongoDB limit)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Top Rated Machinery
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Equipment for Rent
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Hand-picked, fully inspected, and approved machines available for instant booking.
            </p>
          </div>
          <Link href="/all-equipment" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Equipment
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse">
                <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col h-full"
              >
                <div className="group flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-amber-500/40 transition-all duration-300">
                  {/* Image container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="warning" className="bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <Badge variant={item.availableQuantity > 0 ? "success" : "danger"}>
                        {item.availableQuantity > 0 ? `${item.availableQuantity} Available` : "Out of Stock"}
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(e, item._id)}
                        className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md group/fav border border-white/20 active:scale-95"
                        title={favoriteIds.includes(item._id) ? "Remove from favorites" : "Add to favorites"}
                        aria-label="Add to favorites"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            favoriteIds.includes(item._id)
                              ? "fill-red-500 text-red-500"
                              : "text-white group-hover/fav:text-red-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{item.location}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Rate ({item.rentalType})</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          ৳{item.rentalPrice?.toLocaleString()}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/{item.rentalType.toLowerCase()}</span>
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => handleViewDetails(item._id)}
                        className="shadow-md shadow-amber-500/10"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 dark:text-white">No featured equipment found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check back soon as new verified items are listed daily.</p>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: CATEGORIES SECTION (Framer Motion Animation per Requirement 165)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Tag className="w-3.5 h-3.5" />
            Diverse Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Popular Equipment Categories
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Find the exact tools, vehicles, and industrial machinery tailored for your operational needs.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/all-equipment?category=${encodeURIComponent(cat.name)}`}
                  className="block h-full p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {cat.name}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-amber-500">
                    {cat.count}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 4: WHY CHOOSE US
         ========================================================================= */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-20 border-y border-slate-200 dark:border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              The RentEquip Advantage
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Industry Leaders Choose Our Platform
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              We eliminate friction, middlemen, and high capital equipment costs through verified, direct rental transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Affordable Rental Rates</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Save up to 40% compared to traditional dealership rentals with zero hidden markup fees or broker cuts.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verified Equipment Owners</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every owner is verified through government ID, commercial licenses, and real-time maintenance records.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <CalendarRange className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Flexible Rental Periods</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose daily, weekly, or multi-month leases with instant extension capabilities right from your dashboard.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure Stripe Protection</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated Stripe checkout sessions, instant receipt generation, and escrow-backed deposit hold management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER REVIEWS (At least 4 verified reviews per Requirement 145)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sample Customer Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Professionals in Bangladesh
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Demonstration customer testimonials reflecting authentic commercial equipment rental experiences across Dhaka, Chattogram, and Sylhet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                  }}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rev.role} &bull; <span className="text-amber-500 font-medium">{rev.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: EXTRA SECTION 1 — HOW IT WORKS (4-Step Workflow)
         ========================================================================= */}
      <section className="bg-slate-900 text-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Simple 4-Step Process
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Equipment Rental Works
            </h2>
            <p className="mt-3 text-base text-slate-400">
              From finding the ideal machine to returning it upon project completion, the entire workflow takes under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-4xl font-black text-amber-500/30 mb-4">01</div>
              <h3 className="text-xl font-bold mb-2">Search & Filter</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Locate equipment by category, machine capacity, location, and daily rate with real-time availability.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-4xl font-black text-amber-500/30 mb-4">02</div>
              <h3 className="text-xl font-bold mb-2">Select Duration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose start and end dates. Total rental costs, deposits, and delivery terms are calculated instantly.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-4xl font-black text-amber-500/30 mb-4">03</div>
              <h3 className="text-xl font-bold mb-2">Stripe Checkout</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pay securely using credit card via Stripe. Booking details are recorded into your Customer Dashboard.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-4xl font-black text-amber-500/30 mb-4">04</div>
              <h3 className="text-xl font-bold mb-2">Get to Work</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pick up the machine or arrange on-site drop-off. Return when finished with single-click sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: EXTRA SECTION 2 — PLATFORM METRICS & CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Have Idle Commercial Equipment Sitting in Your Yard?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-amber-100 max-w-xl leading-relaxed">
                List your machinery today and join 500+ verified equipment owners earning predictable monthly passive income.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={user ? "/dashboard/owner/add" : "/register"}>
                  <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 px-8 h-12 shadow-lg">
                    Start Renting Your Gear
                  </Button>
                </Link>
                <Link href="/all-equipment">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 h-12">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-3xl sm:text-4xl font-black">10,000+</p>
                <p className="text-xs sm:text-sm text-amber-100 mt-1">Completed Rentals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-3xl sm:text-4xl font-black">500+</p>
                <p className="text-xs sm:text-sm text-amber-100 mt-1">Verified Owners</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-3xl sm:text-4xl font-black">99.8%</p>
                <p className="text-xs sm:text-sm text-amber-100 mt-1">On-Time Return</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-3xl sm:text-4xl font-black">24/7</p>
                <p className="text-xs sm:text-sm text-amber-100 mt-1">Priority Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
