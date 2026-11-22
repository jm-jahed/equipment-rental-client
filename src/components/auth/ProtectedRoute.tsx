"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import Loading from "@/app/loading";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
      if (currentPath && currentPath !== "/login") {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  // Prevent redirect to login on page reload while session hydrates
  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  // Check role authorization if restricted
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md">
          You are signed in as a <span className="font-semibold text-slate-900 dark:text-white">{user.role}</span>. You do not have permission to access this area.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
