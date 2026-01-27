"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/components/SupabaseSessionProvider";
import {
  MessageSquare,
  ChevronLeft,
  User,
  Clock,
  Shield,
  MapPin,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatAgeGrade } from "@/lib/utils";

export default function DiscussionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useSupabaseSession();
  const router = useRouter();
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(`/api/discussions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDiscussion(data);
      } else {
        router.push("/dialogue");
      }
    } catch (error) {
      console.error("Failed to fetch discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSubmittingReply(true);
    try {
      const response = await fetch(`/api/discussions/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply }),
      });

      if (response.ok) {
        setReply("");
        fetchDiscussion();
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!confirm("Are you sure you want to delete this dialogue?")) return;
    try {
      const response = await fetch(`/api/discussions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/dialogue");
      }
    } catch (error) {
      console.error("Failed to delete discussion:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!discussion) return null;

  const isAuthor = !!user && user.id === discussion.authorId;

  return (
    <div className="max-w-5xl mx-auto px-native py-native bg-background min-h-screen">
      <Link
        href="/dialogue"
        className="inline-flex items-center space-x-3 text-primary font-black uppercase tracking-widest mb-10 hover:text-secondary transition-all active:scale-95 text-xs bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Dialogue Board</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 sm:gap-16">
        {/* Discussion Content */}
        <div className="lg:col-span-3 space-y-12 sm:space-y-16">
          <article className="card-premium overflow-hidden border-none shadow-2xl">
            <div className="p-8 md:p-12 lg:p-16">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-border/30 pb-10">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-primary text-background rounded-2xl flex items-center justify-center font-bold text-2xl border border-primary/10 shadow-lg">
                    {discussion.author.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-serif font-bold text-primary text-lg">
                        {discussion.author.name}
                      </h3>
                      <span className="bg-primary/5 text-primary text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-[0.2em] border border-primary/10">
                        OP
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase font-black tracking-widest mt-2">
                      <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-lg border border-secondary/10">
                        {discussion.village}
                      </span>
                      <div className="flex items-center space-x-2 text-accent bg-accent/10 px-3 py-1 rounded-lg border border-accent/10">
                        <span>
                          {formatAgeGrade(discussion.author.ageGrade).name}
                        </span>
                        <span className="text-[9px] opacity-40 lowercase font-medium tracking-normal italic">
                          {formatAgeGrade(discussion.author.ageGrade).years}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 shrink-0">
                  {isAuthor && (
                    <button
                      onClick={handleDeleteDiscussion}
                      className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm active:scale-95"
                      title="Delete Dialogue"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex items-center space-x-2 text-[10px] text-foreground/20 font-black uppercase tracking-widest italic">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-primary mb-10 leading-tight tracking-tight">
                {discussion.title}
              </h1>

              <div className="text-lg sm:text-xl leading-relaxed text-foreground/80 whitespace-pre-wrap italic border-l-8 border-secondary/20 pl-8 sm:pl-12 py-2 font-serif selection:bg-secondary/10">
                {discussion.content}
              </div>
            </div>
          </article>

          {/* Replies Section */}
          <div className="space-y-10">
            <div className="flex items-center space-x-4 text-primary">
              <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-serif font-bold tracking-tight">
                  Community Consultation
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                  {discussion.replies?.length || 0} contributions published
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {discussion.replies?.map((r: any) => (
                <div
                  key={r.id}
                  className="card-premium p-6 sm:p-10 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 transition-all hover:shadow-2xl border-none shadow-md"
                >
                  <div className="flex items-center sm:items-start sm:flex-shrink-0 space-x-4 sm:space-x-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-background rounded-2xl flex items-center justify-center font-bold text-xl border border-secondary/10 shadow-lg">
                      {r.author.name[0]}
                    </div>
                    <div className="sm:hidden space-y-1">
                      <span className="block font-serif font-bold text-primary leading-tight text-lg">
                        {r.author.name}
                      </span>
                      <div className="flex items-center space-x-2 text-[8px] font-black uppercase tracking-[0.15em]">
                        <span className="text-secondary">
                          {r.author.village}
                        </span>
                        <span className="text-foreground/20 italic font-medium tracking-normal">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="hidden sm:flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-serif font-bold text-primary text-xl">
                          {r.author.name}
                        </span>
                        <div className="flex items-center space-x-3 bg-primary/5 px-3 py-1 rounded-lg border border-primary/10 uppercase font-black tracking-widest text-[9px]">
                          <span className="text-secondary">
                            {r.author.village}
                          </span>
                          <span className="text-foreground/20">•</span>
                          <div className="flex items-center space-x-2 text-accent">
                            <span>
                              {formatAgeGrade(r.author.ageGrade).name}
                            </span>
                            <span className="opacity-40 lowercase font-medium tracking-normal italic">
                              {formatAgeGrade(r.author.ageGrade).years}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-foreground/20 font-black uppercase tracking-widest italic ml-auto">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="sm:hidden">
                      <div className="inline-flex items-center space-x-2 bg-accent/5 px-3 py-1 rounded-lg border border-accent/10 uppercase font-black tracking-widest text-[8px] text-accent">
                        <span>{formatAgeGrade(r.author.ageGrade).name}</span>
                        <span className="opacity-40 lowercase font-medium tracking-normal italic">
                          {formatAgeGrade(r.author.ageGrade).years}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground/60 text-base leading-relaxed sm:text-lg font-medium italic border-l-2 border-secondary/10 pl-6">
                      {r.content}
                    </p>
                  </div>
                </div>
              ))}

              {discussion.replies?.length === 0 && (
                <div className="text-center py-20 bg-secondary/5 border border-dashed border-secondary/20 rounded-[3rem] opacity-50">
                  <MessageSquare className="w-16 h-16 text-secondary/20 mx-auto mb-6" />
                  <p className="text-primary font-serif italic text-lg">
                    No contributions have been made to this dialogue yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="card-premium p-8 border-none shadow-xl sticky top-24">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-8 flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <span>Your Contribution</span>
            </h3>

            {user ? (
              <form onSubmit={handleReplySubmit} className="space-y-6">
                <textarea
                  placeholder="Share your perspective..."
                  className="w-full bg-primary/5 border border-primary/10 rounded-2xl p-4 text-base focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none min-h-[180px] resize-none leading-relaxed transition-all font-medium italic"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submittingReply || !reply.trim()}
                  className="w-full bg-primary text-background py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {submittingReply ? "Consulting..." : "Publish Contribution"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-foreground/40 mb-6 font-serif italic">
                  You must be logged in to participate in village dialogue.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-primary text-background px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-all"
                >
                  Enter the Hub
                </Link>
              </div>
            )}
          </div>

          <div className="bg-accent/5 border border-accent/10 rounded-[2rem] p-8 shadow-inner">
            <h4 className="text-[9px] font-black text-accent uppercase tracking-[0.3em] mb-6 flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3" />
              </div>
              <span>Village Protocol</span>
            </h4>
            <ul className="text-[11px] text-foreground/50 space-y-4 leading-relaxed font-black uppercase tracking-[0.1em]">
              <li className="flex items-start space-x-3">
                <span className="text-accent mt-1">•</span>
                <span>Acknowledge your roots</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent mt-1">•</span>
                <span>Respect elder wisdom</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent mt-1">•</span>
                <span>Support youth growth</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-accent mt-1">•</span>
                <span>Seek consensus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
