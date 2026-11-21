"use client";

import React from "react";
import {
  Wrench,
  Shield,
  Users,
  Award,
  Building,
} from "lucide-react";

export default function AboutUsPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety First",
      desc: "Every equipment owner and listing is strictly verified. We prioritize safety certifications, maintenance logs, and identity validation.",
    },
    {
      icon: Users,
      title: "Community of Builders",
      desc: "We connect independent contractors, industrial suppliers, and event managers to empower local job sites and reduce equipment downtime.",
    },
    {
      icon: Award,
      title: "Zero Hidden Fees",
      desc: "Transparent rental pricing calculated per day, week, or month. What you see is what you pay with seamless Stripe payment protection.",
    },
    {
      icon: Building,
      title: "Sustainable Machinery Use",
      desc: "By maximizing the utilization of existing heavy machinery, we reduce industrial waste and help local construction firms thrive.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            About RentEquip
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bridging the Gap in Heavy Machinery Rentals
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Founded with the mission to modernize construction logistics, RentEquip provides a peer-to-peer and commercial rental platform connecting certified equipment owners with contractors and individual builders.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <v.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{v.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Wrench className="w-10 h-10" />
          </div>
          <div className="space-y-3 text-center md:text-left flex-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Built for Contractors. Powered by Modern Web Engineering.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Equipped with RS256 JWKS JWT authentication, role-based access control, Stripe Checkout integration, and MongoDB dynamic aggregations, RentEquip sets the standard for high-performance enterprise equipment rental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
