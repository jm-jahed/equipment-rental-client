"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Calendar, MapPin, Phone, FileText, CreditCard, Loader2, AlertCircle } from "lucide-react";

interface EquipmentBookingInfo {
  _id: string;
  name: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  image?: string;
  location?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentBookingInfo;
}

export function BookingModal({ isOpen, onClose, equipment }: BookingModalProps) {
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalCost = durationDays * (equipment.rentalPrice || 0) * quantity;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!contactNumber.trim()) {
      setErrorMsg("Please provide a valid contact phone number.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMsg("Please provide a delivery address.");
      return;
    }

    if (quantity < 1 || quantity > equipment.availableQuantity) {
      setErrorMsg(`Quantity must be between 1 and ${equipment.availableQuantity}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Your session has expired. Please log in to complete your booking.");
        setIsSubmitting(false);
        return;
      }
      const apiUrl = API_BASE_URL;

      const res = await fetch(`${apiUrl}/api/bookings/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipmentId: equipment._id,
          startDate,
          endDate,
          quantity,
          contactNumber: contactNumber.trim(),
          deliveryAddress: deliveryAddress.trim(),
          additionalNotes: additionalNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate booking checkout.");
      }

      if (data.url) {
        // Redirect directly to Stripe Checkout hosted page
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL missing in response.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMsg(err.message || "An unexpected error occurred while processing checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Equipment Rental">
      <form onSubmit={handleCheckout} className="space-y-5">
        {/* Equipment Mini Banner */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          {equipment.image ? (
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold text-lg">
              {equipment.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {equipment.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ৳{equipment.rentalPrice?.toLocaleString()} / {equipment.rentalType?.toLowerCase() || "daily"} &bull; {equipment.availableQuantity ?? 0} available
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Rental Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (new Date(e.target.value) > new Date(endDate)) {
                    setEndDate(e.target.value);
                  }
                }}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Quantity & Contact Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quantity Required
            </label>
            <input
              type="number"
              min={1}
              max={equipment.availableQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(equipment.availableQuantity, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Max available: {equipment.availableQuantity}
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                placeholder="+880 1800-000000"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Delivery / Job Site Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Full delivery address or job site coordinates"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Special Instructions / Notes (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <textarea
              rows={2}
              placeholder="e.g., Gate code, access hours, preferred drop-off location"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Duration:</span>
            <span className="font-medium text-slate-900 dark:text-white">{durationDays} Day{durationDays > 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Rate:</span>
            <span className="font-medium text-slate-900 dark:text-white">৳{equipment.rentalPrice?.toLocaleString()} &times; {quantity} unit{quantity > 1 ? "s" : ""}</span>
          </div>
          <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Estimated Total:</span>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">৳{totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || equipment.availableQuantity === 0}
            className="min-w-[170px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with Stripe
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
