import React from "react";
import Link from "next/link";
import { Search, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-[65vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 mb-6">
        <Search className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <Link href="/equipment">
          <Button variant="outline">
            Browse Equipment
          </Button>
        </Link>
      </div>
    </div>
  );
}
