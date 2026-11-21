"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Search,
  CreditCard,
  Truck,
  RotateCcw,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Discover & Filter Machinery",
      description:
        "Browse thousands of verified heavy machines, construction tools, and audio/visual rigs. Filter by exact category, rental frequency, price range, and geographic location.",
    },
    {
      num: "02",
      icon: CreditCard,
      title: "Reserve & Pay with Stripe",
      description:
        "Choose your project rental window and quantity. Complete checkout instantly with Stripe's bank-grade security. Funds are held safely until hand-off.",
    },
    {
      num: "03",
      icon: Truck,
      title: "Direct Job-Site Delivery",
      description:
        "Coordinate pickup or job-site drop-off directly with the equipment owner. All machinery undergoes pre-dispatch safety and operational verification.",
    },
    {
      num: "04",
      icon: RotateCcw,
      title: "Operate & Return Hassle-Free",
      description:
        "Put the gear to work. When your project wraps up, simply return the machinery or request a scheduled return pickup. The system marks your rental completed.",
    },
  ];

  const faqs = [
    {
      q: "How does the Stripe security deposit work?",
      a: "When you book equipment, your rental payment is processed securely through Stripe. No card details ever touch our servers.",
    },
    {
      q: "Can I list my own equipment as an Owner?",
      a: "Absolutely! Create an account and request Owner role or list equipment directly from the Owner Dashboard. Your listings are reviewed by administrators before going live.",
    },
    {
      q: "What happens if equipment requires repair or maintenance during the rental?",
      a: "All equipment on RentEquip must pass verification. In the rare event of equipment failure, owners provide immediate replacements or pro-rated refunds.",
    },
    {
      q: "Are rental periods flexible?",
      a: "Yes. Equipment can be booked on Daily, Weekly, or Monthly terms with transparent rate discounts calculated automatically at checkout.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Simple 4-Step Process
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How RentEquip Works for Builders & Owners
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From industrial excavators to precision carpentry tools, our verified marketplace makes heavy equipment rental fast, secure, and transparent.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-4">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">Everything you need to know about the platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to equip your next project?</h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto">
            Browse our full equipment catalog or register as an equipment provider today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/equipment">
              <Button variant="secondary" className="w-full sm:w-auto font-bold">
                Browse All Equipment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Join RentEquip
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
