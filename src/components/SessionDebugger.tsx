"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SessionDebugger() {
  const { data: session, status, update } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV === "production" && !isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9999] max-w-sm">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-primary text-background px-3 py-1 rounded-t-lg text-xs font-bold uppercase tracking-widest shadow-lg"
      >
        {isVisible ? "Hide Debug" : "Show Debug"}
      </button>

      {isVisible && (
        <div className="bg-card border-2 border-primary p-4 rounded-l-lg rounded-br-lg shadow-2xl overflow-auto max-h-[400px] text-[10px] font-mono">
          <div className="flex justify-between items-center mb-2 border-b border-border pb-1">
            <span className="font-black text-primary uppercase tracking-widest">
              Session Data
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                status === "authenticated"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-secondary font-bold uppercase tracking-tighter mb-1 opacity-50">
                User Profile
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-primary/5 p-2 rounded-lg border border-primary/10">
                <span className="text-foreground/40 font-black">ID:</span>
                <span className="text-primary font-bold truncate">
                  {(session?.user as any)?.id || "null"}
                </span>

                <span className="text-foreground/40 font-black">Name:</span>
                <span className="text-primary font-bold">
                  {session?.user?.name || "null"}
                </span>

                <span className="text-foreground/40 font-black">Type:</span>
                <span
                  className={`font-bold ${
                    (session?.user as any)?.userType === "NDI_OGO"
                      ? "text-secondary"
                      : "text-primary"
                  }`}
                >
                  {(session?.user as any)?.userType || "null"}
                </span>

                <span className="text-foreground/40 font-black">Village:</span>
                <span className="text-primary font-bold">
                  {(session?.user as any)?.village || "null"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-secondary font-bold uppercase tracking-tighter mb-1 opacity-50">
                Onboarding State
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-accent/5 p-2 rounded-lg border border-accent/10">
                <span className="text-foreground/40 font-black">Step:</span>
                <span className="text-accent font-bold">
                  {(session?.user as any)?.onboardingStep || "0"}
                </span>

                <span className="text-foreground/40 font-black">
                  Completed:
                </span>
                <span
                  className={`font-black uppercase ${
                    (session?.user as any)?.onboardingCompleted
                      ? "text-green-600"
                      : "text-red-600 animate-pulse"
                  }`}
                >
                  {String((session?.user as any)?.onboardingCompleted)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <button
                onClick={() => update()}
                className="w-full bg-secondary text-background py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-secondary/90 transition-all active:scale-95 shadow-sm"
              >
                Refresh Session
              </button>
              <p className="text-[8px] text-foreground/30 leading-tight italic">
                * If "Completed" is false, you will be redirected to /onboarding
                from protected pages.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
