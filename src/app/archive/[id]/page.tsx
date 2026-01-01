"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
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

  const isAuthor = session?.user?.email === post.author.email;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Link
        href="/archive"
        className="inline-flex items-center space-x-2 text-primary font-bold mb-8 hover:text-primary/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Archive</span>
      </Link>

      <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg mb-8 sm:mb-12">
        {post.imageUrl && (
          <div className="h-48 sm:h-96 w-full relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="bg-accent/90 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg backdrop-blur-sm shadow-sm">
                {post.type}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-8 md:p-12">
          <div className="mb-6 sm:mb-8 border-b border-border pb-6 sm:pb-8">
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary">
              <div className="flex items-center space-x-2 bg-primary/5 p-2 rounded-lg border border-primary/5 lg:bg-transparent lg:p-0 lg:border-none">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="font-bold truncate">{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/5 p-2 rounded-lg border border-secondary/5 lg:bg-transparent lg:p-0 lg:border-none">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                <span className="font-bold uppercase tracking-wider truncate">
                  {post.author.village}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-accent/5 p-2 rounded-lg border border-accent/5 lg:bg-transparent lg:p-0 lg:border-none">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                <span className="font-bold truncate">
                  {post.author.ageGrade}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-foreground/5 p-2 rounded-lg border border-foreground/5 lg:bg-transparent lg:p-0 lg:border-none">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/40" />
                <span className="font-medium text-foreground/50 truncate">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isAuthor && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleDeletePost}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 shadow-sm"
                  title="Delete Story"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-6 sm:mb-10 leading-tight">
            {post.title}
          </h1>

          <div className="text-base sm:text-lg leading-relaxed text-foreground/80 space-y-6 whitespace-pre-wrap font-serif italic selection:bg-accent/20">
            {post.content}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-12">
        <div className="flex items-center space-x-2 text-primary mb-8">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-2xl font-serif font-bold">Dialogue</h2>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-bold">
            {post.comments?.length || 0}
          </span>
        </div>

        {session ? (
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <textarea
                placeholder="Share your thoughts or add to this account..."
                className="w-full bg-transparent border-none focus:ring-0 text-foreground/80 leading-relaxed min-h-[100px] resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end pt-4 border-t border-border/50">
                <button
                  type="submit"
                  disabled={submittingComment || !comment.trim()}
                  className="bg-primary text-background px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {submittingComment ? "Sharing..." : "Share Thought"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center mb-12">
            <p className="text-primary font-medium mb-4">
              Log in to join the dialogue and contribute to this archive.
            </p>
            <Link href="/login" className="text-accent underline font-bold">
              Log in to your account
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {post.comments?.map((c: any) => (
            <div
              key={c.id}
              className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center sm:items-start sm:flex-shrink-0 space-x-3 sm:space-x-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold border border-primary/5">
                  {c.author.name[0]}
                </div>
                <div className="sm:hidden">
                  <span className="block font-serif font-bold text-primary leading-tight">
                    {c.author.name}
                  </span>
                  <span className="block text-[10px] text-foreground/40 font-medium">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-primary text-base">
                      {c.author.name}
                    </span>
                    <div className="flex items-center space-x-1 bg-secondary/10 px-2 py-0.5 rounded uppercase font-sans tracking-tight">
                      <span className="text-secondary text-[9px] font-bold">
                        {formatAgeGrade(c.author.ageGrade).name}
                      </span>
                      <span className="text-secondary text-[8px] opacity-50 font-medium">
                        {formatAgeGrade(c.author.ageGrade).years}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-foreground/40 font-medium">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="sm:hidden mb-2">
                  <div className="inline-flex items-center space-x-1 bg-secondary/10 px-2 py-0.5 rounded uppercase font-sans tracking-tight">
                    <span className="text-secondary text-[9px] font-bold">
                      {formatAgeGrade(c.author.ageGrade).name}
                    </span>
                    <span className="text-secondary text-[8px] opacity-50 font-medium">
                      {formatAgeGrade(c.author.ageGrade).years}
                    </span>
                  </div>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed sm:text-base">
                  {c.content}
                </p>
              </div>
            </div>
          ))}

          {post.comments?.length === 0 && (
            <div className="text-center py-12 text-foreground/40 italic">
              No thoughts shared yet. Be the first to start the dialogue.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
