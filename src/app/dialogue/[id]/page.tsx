"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
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
import { useRouter } from "next/navigation";
import { formatAgeGrade } from "@/lib/utils";

export default function DiscussionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
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

  const isAuthor = session?.user?.email === discussion.author.email;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <Link
        href="/dialogue"
        className="inline-flex items-center space-x-2 text-primary font-bold mb-8 hover:text-primary/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Dialogue Board</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Discussion Content */}
        <div className="lg:col-span-3 space-y-8">
          <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl font-serif">
                    {discussion.author.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-bold text-primary">
                        {discussion.author.name}
                      </h3>
                      <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-primary/10">
                        OP
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] uppercase font-bold tracking-widest text-foreground/40 mt-1">
                      <span className="text-secondary">
                        {discussion.village} VILLAGE
                      </span>
                      <span className="text-accent">
                        {discussion.author.ageGrade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {isAuthor && (
                    <button
                      onClick={handleDeleteDiscussion}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 shadow-sm"
                      title="Delete Dialogue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center space-x-2 text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>
                      STARTED{" "}
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold text-primary mb-6 leading-tight">
                {discussion.title}
              </h1>

              <div className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap italic border-l-4 border-secondary/20 pl-6 py-2">
                {discussion.content}
              </div>
            </div>
          </article>

          {/* Replies Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-primary flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Community Consultation</span>
              <span className="bg-primary/5 text-primary text-xs px-2 py-0.5 rounded ml-2">
                {discussion.replies?.length || 0} REPLIES
              </span>
            </h2>

            {discussion.replies?.map((r: any) => (
              <div
                key={r.id}
                className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-all hover:shadow-md"
              >
                <div className="flex items-center sm:items-start sm:flex-shrink-0 space-x-3 sm:space-x-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-bold border border-secondary/5">
                    {r.author.name[0]}
                  </div>
                  <div className="sm:hidden">
                    <span className="block font-serif font-bold text-primary leading-tight">
                      {r.author.name}
                    </span>
                    <span className="block text-[10px] text-foreground/40 font-medium tracking-tight">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="hidden sm:flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-serif font-bold text-primary text-base">
                        {r.author.name}
                      </span>
                      <div className="flex items-center space-x-2 text-[9px] uppercase font-bold tracking-widest text-foreground/40 font-sans">
                        <span className="text-secondary bg-secondary/5 px-2 py-0.5 rounded">
                          {r.author.village}
                        </span>
                        <div className="flex items-center space-x-1 text-accent bg-accent/5 px-2 py-0.5 rounded">
                          <span className="font-bold">
                            {formatAgeGrade(r.author.ageGrade).name}
                          </span>
                          <span className="opacity-50 font-medium lowercase tracking-normal">
                            {formatAgeGrade(r.author.ageGrade).years}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-foreground/30 font-medium">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="sm:hidden flex flex-wrap gap-2 mb-2">
                    <span className="text-secondary bg-secondary/5 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                      {r.author.village}
                    </span>
                    <div className="inline-flex items-center space-x-1 text-accent bg-accent/5 px-2 py-0.5 rounded uppercase tracking-widest">
                      <span className="text-[8px] font-bold">
                        {formatAgeGrade(r.author.ageGrade).name}
                      </span>
                      <span className="text-[7px] opacity-70 font-medium lowercase tracking-normal">
                        {formatAgeGrade(r.author.ageGrade).years}
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed sm:text-base">
                    {r.content}
                  </p>
                </div>
              </div>
            ))}

            {discussion.replies?.length === 0 && (
              <div className="text-center py-16 bg-primary/5 border border-dashed border-primary/20 rounded-2xl opacity-50">
                <MessageSquare className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <p className="text-primary font-serif italic">
                  No contributions have been made to this dialogue yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-8">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Your Contribution</span>
            </h3>

            {session ? (
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <textarea
                  placeholder="Share your perspective..."
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[150px] resize-none leading-relaxed transition-all"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submittingReply || !reply.trim()}
                  className="w-full bg-primary text-background py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {submittingReply ? "Consulting..." : "Publish Contribution"}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-foreground/60 mb-4">
                  You must be logged in to participate in village dialogue.
                </p>
                <Link
                  href="/login"
                  className="text-primary font-bold text-sm hover:underline"
                >
                  Log in to join
                </Link>
              </div>
            )}
          </div>

          <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
            <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>Village Protocol</span>
            </h4>
            <ul className="text-[11px] text-foreground/60 space-y-3 leading-relaxed">
              <li>• Always acknowledge your village roots.</li>
              <li>• Respect the wisdom of your elders.</li>
              <li>• Support the growth of our youth.</li>
              <li>• Build through consensus and dialogue.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
