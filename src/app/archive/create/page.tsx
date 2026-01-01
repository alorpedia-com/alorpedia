"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Type, Image as ImageIcon, Send } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "ARTICLE",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/archive");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Contribute to the Archive
        </h1>
        <p className="text-foreground/60">
          Share a piece of Alor history or a family biography.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    Entry Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "ARTICLE" })
                      }
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        formData.type === "ARTICLE"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-foreground/50 hover:border-primary/50"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="font-bold text-sm">Article</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "BIOGRAPHY" })
                      }
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        formData.type === "BIOGRAPHY"
                          ? "border-secondary bg-secondary/5 text-secondary"
                          : "border-border text-foreground/50 hover:border-secondary/50"
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      <span className="font-bold text-sm">Biography</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-primary uppercase tracking-wider mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="E.g., The History of Umunri Village"
                    className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 font-serif text-lg"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-bold text-primary uppercase tracking-wider mb-2"
                  >
                    Cover Image URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input
                      id="imageUrl"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 text-sm"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <label
                  htmlFor="content"
                  className="block text-sm font-bold text-primary uppercase tracking-wider mb-2"
                >
                  The Story
                </label>
                <textarea
                  id="content"
                  required
                  placeholder="Tell the story of our people..."
                  className="flex-grow w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-foreground/30 min-h-[300px] leading-relaxed"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-primary text-background px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-background"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish to Archive</span>
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
