"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/components/SupabaseSessionProvider";
import { BookOpen, Type, Image as ImageIcon, Send, X } from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSupabaseSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "ARTICLE",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      // Upload image to Cloudinary if selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("folder", "alorpedia/posts");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload image");
        }
        setUploading(false);
      }

      // Create post with Cloudinary URL
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl || formData.imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/archive");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
      setUploading(false);
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
                          ? "border-accent bg-accent/5 text-secondary font-bold"
                          : "border-border text-foreground/50 hover:border-accent/50"
                      }`}
                    >
                      <Type
                        className={`w-4 h-4 ${
                          formData.type === "BIOGRAPHY" ? "text-accent" : ""
                        }`}
                      />
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
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    Cover Image
                  </label>
                  <div className="relative">
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-foreground/30 group-hover:text-primary/50 mb-2 transition-colors" />
                          <p className="text-sm text-foreground/50 font-medium">
                            Click to upload cover photo
                          </p>
                          <p className="text-xs text-foreground/30 mt-1">
                            PNG, JPG or WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      <div className="relative group rounded-xl overflow-hidden border border-border shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
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
                disabled={loading || uploading}
                className="flex items-center space-x-2 bg-primary text-background px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {loading || uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-background"></div>
                    <span>
                      {uploading ? "Uploading image..." : "Publishing..."}
                    </span>
                  </div>
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
