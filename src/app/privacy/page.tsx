import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            RentEquip collects account registration details (name, email address, password hashes), profile data (phone, delivery address, profile picture), and rental transaction records.
          </p>
        </section>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Payment Security</h2>
          <p>
            All payment transactions are handled directly through Stripe Test Mode. We do not store credit card numbers on our servers.
          </p>
        </section>
        <section className="space-y-3 text-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Public Data Protection</h2>
          <p>
            Public equipment catalogs show only owner names and avatars. Owner emails and phone numbers are protected and only accessible to authenticated users on details pages.
          </p>
        </section>
      </div>
    </div>
  );
}
