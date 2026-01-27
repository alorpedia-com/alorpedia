"use client";

import { useState, useEffect, use } from "react";
import { useSupabaseSession } from "@/components/SupabaseSessionProvider";
import {
  User,
  Calendar,
  MapPin,
  Shield,
  MessageSquare,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatAgeGrade } from "@/lib/utils";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useSupabaseSession();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        router.push("/archive");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });

      if (response.ok) {
        setComment("");
        fetchPost(); // Refresh post to show new comment
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.push("/archive");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = !!user && user.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto px-native py-native bg-background min-h-screen">
      <Link
        href="/archive"
        className="inline-flex items-center space-x-3 text-primary font-black uppercase tracking-widest mb-10 hover:text-secondary transition-all active:scale-95 text-xs bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Archive</span>
      </Link>

      <article className="card-premium overflow-hidden border-none shadow-2xl mb-12 sm:mb-20">
        {post.imageUrl && (
          <div className="h-64 sm:h-[32rem] w-full relative group">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute top-8 left-8">
              <span className="bg-accent text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl backdrop-blur-xl">
                {post.type}
              </span>
            </div>
          </div>
        )}

        <div className="p-8 sm:p-12 md:p-16">
          <div className="mb-10 sm:mb-16 border-b border-border/30 pb-10 sm:pb-16">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs uppercase font-black tracking-widest">
              <div className="flex items-center space-x-3 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                <div className="w-6 h-6 bg-primary text-background rounded-lg flex items-center justify-center font-bold text-[10px]">
                  {post.author.name[0]}
                </div>
                <span className="text-primary">{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/10 text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <span>{post.author.village}</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-xl border border-accent/10 text-accent">
                <Shield className="w-3.5 h-3.5" />
                <div className="flex items-baseline space-x-2">
                  <span>{formatAgeGrade(post.author.ageGrade).name}</span>
                  <span className="text-[10px] opacity-40 lowercase font-medium tracking-normal italic">
                    {formatAgeGrade(post.author.ageGrade).years}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-foreground/20 font-medium tracking-normal italic ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {isAuthor && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleDeletePost}
                  className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm active:scale-95"
                  title="Delete Story"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold md:font-black text-primary mb-10 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="text-base md:text-lg lg:text-xl text-justify leading-relaxed text-foreground/80 space-y-10 whitespace-pre-wrap font-serif selection:bg-accent/20 border-l-8 border-primary/5 pl-8 sm:pl-12">
            {post.content}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-20 sm:mt-32">
        <div className="flex items-center space-x-4 text-primary mb-12">
          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold tracking-tight">Dialogue</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
              {post.comments?.length || 0} contributions shared
            </p>
          </div>
        </div>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-16">
            <div className="card-premium p-6 sm:p-8 border-none shadow-xl">
              <textarea
                placeholder="Share your thoughts or add to this account..."
                className="w-full bg-transparent border-none focus:ring-0 text-foreground/70 leading-relaxed min-h-[150px] resize-none text-lg font-medium italic"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end pt-6 border-t border-border/30">
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="bg-primary text-background px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {submittingComment ? "Sharing..." : "Share Thought"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[2rem] p-12 text-center mb-16">
            <p className="text-primary font-serif text-lg italic mb-6">
              Log in to join the dialogue and contribute to this archive.
            </p>
            <Link
              href="/login"
              className="inline-block bg-primary text-background px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all"
            >
              Enter the Hub
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {post.comments?.map((c: any) => (
            <div
              key={c.id}
              className="card-premium p-6 sm:p-10 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 transition-all hover:shadow-2xl border-none shadow-md"
            >
              <div className="flex items-center sm:items-start sm:flex-shrink-0 space-x-4 sm:space-x-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary text-background rounded-2xl flex items-center justify-center font-bold text-xl border border-primary/10 shadow-lg">
                  {c.author.name[0]}
                </div>
                <div className="sm:hidden space-y-1">
                  <span className="block font-serif font-bold text-primary leading-tight text-lg">
                    {c.author.name}
                  </span>
                  <div className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-[0.15em]">
                    <span className="text-secondary">{c.author.village}</span>
                    <span className="text-foreground/20 italic font-medium tracking-normal">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-grow space-y-4">
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <span className="font-serif font-bold text-primary text-xl">
                      {c.author.name}
                    </span>
                    <div className="flex items-center space-x-3 bg-secondary/5 px-3 py-1 rounded-lg border border-secondary/10 uppercase font-black tracking-widest text-[9px]">
                      <span className="text-secondary">{c.author.village}</span>
                      <span className="text-foreground/20">•</span>
                      <div className="flex items-center space-x-2 text-accent">
                        <span>{formatAgeGrade(c.author.ageGrade).name}</span>
                        <span className="opacity-40 lowercase font-medium tracking-normal italic">
                          {formatAgeGrade(c.author.ageGrade).years}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-foreground/20 font-black uppercase tracking-widest italic ml-auto">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="sm:hidden">
                  <div className="inline-flex items-center space-x-2 bg-accent/5 px-3 py-1 rounded-lg border border-accent/10 uppercase font-black tracking-widest text-[8px] text-accent">
                    <span>{formatAgeGrade(c.author.ageGrade).name}</span>
                    <span className="opacity-40 lowercase font-medium tracking-normal italic">
                      {formatAgeGrade(c.author.ageGrade).years}
                    </span>
                  </div>
                </div>
                <p className="text-foreground/60 text-base leading-relaxed sm:text-lg font-medium italic border-l-2 border-primary/10 pl-6">
                  {c.content}
                </p>
              </div>
            </div>
          ))}

          {post.comments?.length === 0 && (
            <div className="text-center py-20 bg-primary/5 border border-dashed border-primary/20 rounded-[3rem] opacity-50">
              <MessageSquare className="w-16 h-16 text-primary/20 mx-auto mb-6" />
              <p className="text-primary font-serif italic text-lg">
                The dialogue awaits its first contribution.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
