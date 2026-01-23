"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorCode = searchParams.get("error_code");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Authentication Error
          </h1>

          <p className="text-muted-foreground">
            We couldn't complete your sign-in request.
          </p>

          {errorDescription && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {decodeURIComponent(errorDescription)}
              </p>
              {errorCode && (
                <p className="text-xs text-red-600 mt-1">Code: {errorCode}</p>
              )}
            </div>
          )}

          <div className="w-full pt-4 space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center space-x-2 border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-border w-full">
            <p className="text-xs text-muted-foreground">
              If this problem persists, please try:
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 text-left list-disc list-inside">
              <li>Using email/password login instead</li>
              <li>Clearing your browser cache and cookies</li>
              <li>Trying a different browser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
