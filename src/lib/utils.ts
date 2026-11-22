import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null, currency: string = "BDT") {
  const num = Number(amount) || 0;
  if (currency === "USD") {
    return "$" + num.toLocaleString("en-US");
  }
  return "৳" + num.toLocaleString("en-BD");
}
