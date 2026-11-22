"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Receipt,
  ArrowRight,
  Package,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const apiUrl = API_BASE_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setErrorMsg("Missing Stripe checkout session ID.");
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/bookings/verify-session/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to verify payment session.");
        }

        setBookingData(data.booking);
        setPaymentData(data.payment);
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setErrorMsg(err.message || "An unexpected error occurred while verifying payment.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, apiUrl]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Stripe Payment...</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please do not refresh or close this window.</p>
        </div>
      ) : errorMsg ? (
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Verification Issue</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{errorMsg}</p>
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/equipment">
              <Button variant="primary" className="w-full">
                Return to Equipment
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Success Checkmark Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Booking Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Your Stripe payment has been processed successfully and the owner has been notified.
            </p>
          </div>

          {/* Receipt Details Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Receipt className="w-4 h-4 text-amber-500" />
                <span>Transaction Ref</span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                {paymentData?.transactionId || sessionId}
              </span>
            </div>

            {bookingData?.equipmentId && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Package className="w-4 h-4 text-amber-500" />
                  <span>Equipment</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {bookingData.equipmentId.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Rental Period</span>
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300">
                {new Date(bookingData?.startDate).toLocaleDateString()} &mdash;{" "}
                {new Date(bookingData?.endDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
              <div className="flex gap-1.5">
                <Badge variant="success">Payment: Paid</Badge>
                <Badge variant="info">Status: Confirmed</Badge>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount Paid</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${bookingData?.totalAmount?.toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="primary" className="w-full">
                View My Rentals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/equipment" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse Equipment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </ProtectedRoute>
  );
}
