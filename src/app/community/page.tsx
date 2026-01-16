"use client";

import { useState } from "react";
import { MessageSquare, MessageCircle } from "lucide-react";
import DialoguePage from "@/app/dialogue/page";
import MessagesPage from "@/app/messages/page";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"dialogue" | "messages">(
    "dialogue"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold md:font-bold font-serif text-primary mb-1">
            Community
          </h1>
          <p className="text-xs md:text-base text-foreground/60">
            Connect through discussions and direct messages
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("dialogue")}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "dialogue"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="whitespace-nowrap">Dialogue</span>
            <span className="hidden sm:inline text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              Public
            </span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "messages"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="whitespace-nowrap">Messages</span>
            <span className="hidden sm:inline text-xs bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full">
              Private
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-hidden">
          {activeTab === "dialogue" ? (
            <div className="-mx-4">
              <DialoguePage />
            </div>
          ) : (
            <div className="-mx-4">
              <MessagesPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
