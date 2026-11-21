import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero preview */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
            <Wrench className="w-3.5 h-3.5" />
            Reliable Equipment Rental Platform
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Rent Heavy Machinery & Professional Tools with <span className="text-amber-500">Confidence</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified equipment owners. Browse high-performance construction machinery, photography gear, and vehicles with transparent pricing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/equipment">
              <Button size="lg" variant="primary">
                Explore All Equipment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Verified Owners</p>
                <p className="text-xs text-slate-400">100% vetted listings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Flexible Rental</p>
                <p className="text-xs text-slate-400">Daily, weekly, monthly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Delivery Options</p>
                <p className="text-xs text-slate-400">Direct on-site delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Inspected Gear</p>
                <p className="text-xs text-slate-400">Maintained & ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
