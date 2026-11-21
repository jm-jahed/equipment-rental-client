import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using RentEquip, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Equipment Operations & Safety</h2>
          <p>
            Renters agree to operate machinery solely for lawful purposes according to manufacturer operating guidelines and safety standards.
          </p>
        </section>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Cancellation and Returns</h2>
          <p>
            Rental bookings can be managed through the Customer Dashboard. Automated system status updates mark rentals completed upon passing of the return date.
          </p>
        </section>
      </div>
    </div>
  );
}
