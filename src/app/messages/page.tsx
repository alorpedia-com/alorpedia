"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Participant {
  id: string;
  name: string;
  profileImage?: string;
  village?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetchConversations();
  }, [session, router]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation.messages);

        // Mark messages as read
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "PATCH",
        });

        // Update unread count in local state
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        `/api/conversations/${selectedConversation}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation
              ? {
                  ...conv,
                  lastMessage: data.message,
                  updatedAt: new Date().toISOString(),
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const userId = (session?.user as any)?.id;
    return conversation.participants.find((p) => p.id !== userId);
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const otherParticipant = selectedConv
    ? getOtherParticipant(selectedConv)
    : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full border-x border-border">
          {/* Conversation List */}
          <div
            className={`border-r border-border bg-card ${
              selectedConversation ? "hidden md:block" : "block"
            }`}
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-serif font-bold text-primary">
                Messages
              </h2>
            </div>

            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-foreground/50">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">
                    Start a conversation from the directory
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-background transition-colors ${
                        selectedConversation === conv.id ? "bg-background" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center shrink-0">
                          <span className="font-semibold">
                            {other?.name?.[0] || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm truncate">
                              {other?.name}
                            </h3>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-background text-xs px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-foreground/60 truncate mt-0.5">
                            {conv.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div
            className={`md:col-span-2 flex flex-col ${
              !selectedConversation ? "hidden md:flex" : "flex"
            }`}
          >
            {selectedConversation && otherParticipant ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border bg-card flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center">
                    <span className="font-semibold">
                      {otherParticipant.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{otherParticipant.name}</h3>
                    <p className="text-xs text-foreground/60">
                      {otherParticipant.village}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn =
                      message.senderId === (session?.user as any)?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwn
                              ? "bg-primary text-background"
                              : "bg-card border border-border"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn
                                ? "text-background/70"
                                : "text-foreground/50"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-border bg-card"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-4 py-2 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-foreground/50">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
