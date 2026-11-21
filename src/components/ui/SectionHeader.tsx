import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-12",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3 dark:bg-amber-950/40 dark:text-amber-400">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
