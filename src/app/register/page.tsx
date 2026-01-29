"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
  const router = useRouter();
  const supabase = createClient();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message || "Registration failed. Please try again.");
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          setError("This email is already registered. Please log in.");
        } else {
          // Attempt to create database user
          try {
            // Wait a moment for session to persist in cookies
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Try to pre-create the database user
            await fetch("/api/user/profile", {
              method: "GET",
            });
          } catch (dbError) {
            console.warn(
              "Silent profile creation failed, onboarding will retry:",
              dbError,
            );
          }

          // Final delay before redirect to ensure session is stable
          await new Promise((resolve) => setTimeout(resolve, 400));

          // Successful registration - redirect to onboarding
          router.push("/onboarding");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showEmailForm) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 px-5 bg-background">
        {/* Subtle Home Link */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center space-x-2 text-foreground/40 hover:text-foreground/70 transition-colors group"
        >
          <div className="relative w-5 h-5">
            <Image
              src="/logo.jpg"
              alt="Alorpedia"
              fill
              sizes="20px"
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium">Alorpedia</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setShowEmailForm(false)}
            className="flex items-center space-x-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.jpg"
                  alt="Alorpedia"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
              Create Account
            </h2>
            <p className="text-sm text-foreground/60">
              Enter your email to get started
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-4 text-base border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-primary text-background rounded-2xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-foreground/60 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-5 bg-background">
      {/* Subtle Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-foreground/40 hover:text-foreground/70 transition-colors group"
      >
        <div className="relative w-5 h-5">
          <Image
            src="/logo.jpg"
            alt="Alorpedia"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium">Alorpedia</span>
      </Link>

      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image
                src="/logo.jpg"
                alt="Alorpedia"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            Join Alorpedia
          </h1>
          <p className="text-base text-foreground/70 leading-relaxed">
            Connect with your roots and preserve your heritage
          </p>
        </div>

        {/* Authentication Options */}
        <div className="space-y-4 pt-4">
          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-background border-2 border-border rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-semibold text-foreground">
              {loading ? "Loading..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-foreground/50 font-medium">
                Or
              </span>
            </div>
          </div>

          {/* Email/Password */}
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-primary text-background rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md"
          >
            <Mail className="w-5 h-5" />
            <span className="font-semibold">Continue with Email</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Log in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-xs text-center text-foreground/50 leading-relaxed px-4">
          By continuing, you agree to Alorpedia's Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
