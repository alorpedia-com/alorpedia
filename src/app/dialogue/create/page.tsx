"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, Shield, Info } from "lucide-react";

export default function CreateDiscussionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          village: user.village,
        }),
      });

      if (response.ok) {
        router.push("/dialogue");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to start dialogue");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-foreground/60 hover:text-primary transition-colors mb-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold font-serif text-primary mb-2">
          Start a Dialogue
        </h1>
        <p className="text-xs md:text-base text-foreground/60">
          Your conversation will be tagged with{" "}
          <span className="text-primary font-bold">
            {user?.village} Village
          </span>
          .
        </p>
      </div>

      <div className="bg-card border border-border shadow-md rounded-2xl overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-primary uppercase tracking-wider mb-2"
                >
                  Dialogue Topic
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="What would you like to discuss with the community?"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 font-serif text-lg"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-bold text-primary uppercase tracking-wider mb-2"
                >
                  Opening Statement
                </label>
                <textarea
                  id="content"
                  required
                  placeholder="Provide context for this discussion..."
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 min-h-[200px] leading-relaxed"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 flex items-start space-x-3 border border-primary/10">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-xs text-foreground/70 leading-relaxed">
                <p className="font-bold text-primary mb-1 uppercase tracking-tight">
                  Community Guidelines
                </p>
                As a member of the{" "}
                <span className="font-bold">{user?.ageGrade}</span>, your words
                carry weight. Please ensure your contributions are respectful,
                constructive, and aligned with Alor heritage.
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-primary text-background px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex justify-center py-1">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-background"></div>
                  </div>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Dialogue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
