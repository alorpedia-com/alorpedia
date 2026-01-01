"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  GitBranch,
  Plus,
  UserPlus,
  ShieldAlert,
  Trash2,
  Heart,
  Users,
  ChevronRight,
  Search,
} from "lucide-react";

export default function TreeOfLife() {
  const { data: session } = useSession();
  const [nodes, setNodes] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isRelateOpen, setIsRelateOpen] = useState(false);

  const [newNode, setNewNode] = useState({
    name: "",
    gender: "MALE",
    birthDate: "",
  });
  const [newRel, setNewRel] = useState({
    fromId: "",
    toId: "",
    type: "PARENT_CHILD",
  });

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const response = await fetch("/api/family/nodes");
      if (response.ok) {
        const data = await response.json();
        setNodes(data.nodes);
        setRelationships(data.relationships);
      }
    } catch (error) {
      console.error("Failed to fetch family:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/family/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNode),
      });
      if (response.ok) {
        setIsAddNodeOpen(false);
        setNewNode({ name: "", gender: "MALE", birthDate: "" });
        fetchFamily();
      }
    } catch (error) {
      console.error("Failed to create node:", error);
    }
  };

  const handleCreateRel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/family/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRel),
      });
      if (response.ok) {
        setIsRelateOpen(false);
        setNewRel({ fromId: "", toId: "", type: "PARENT_CHILD" });
        fetchFamily();
      }
    } catch (error) {
      console.error("Failed to create relationship:", error);
    }
  };

  const toggleFlag = async (relId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/family/relationships/${relId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFlagged: !currentStatus }),
      });
      fetchFamily();
    } catch (error) {
      console.error("Failed to flag relationship:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            Osisi Ndụ
          </h1>
          <p className="text-foreground/70 max-w-2xl text-lg">
            "The Tree of Life." Map your lineage, preserve your roots, and
            connect with the living branches of your family.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsAddNodeOpen(true)}
            className="flex items-center space-x-2 bg-primary text-background px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-shadow shadow-md"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Member</span>
          </button>
          <button
            onClick={() => setIsRelateOpen(true)}
            className="flex items-center space-x-2 bg-secondary text-background px-6 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-shadow shadow-md"
          >
            <GitBranch className="w-5 h-5" />
            <span>Link Roots</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Connection visualization / Tree Structure */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-3xl p-8 min-h-[500px] shadow-sm relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]" />

            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-8 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Ancestral Branches</span>
            </h2>

            {nodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <GitBranch className="w-16 h-16 text-primary/10 mb-4" />
                <p className="text-primary font-serif italic max-w-xs">
                  Your family tree is waiting for its first seed. Start by
                  adding your parents or grandparents.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      node.userId
                        ? "border-primary/20 bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div>
                      <h3 className="font-serif font-bold text-primary text-lg">
                        {node.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                          {node.gender}
                        </span>
                        {node.userId && (
                          <span className="bg-primary text-background text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Linked User
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Relationships List / Disputes */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-8 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-accent" />
              <span>Relationship Records</span>
            </h2>

            <div className="space-y-4">
              {relationships.map((rel) => {
                const fromNode = nodes.find((n) => n.id === rel.fromId);
                const toNode = nodes.find((n) => n.id === rel.toId);
                if (!fromNode || !toNode) return null;

                return (
                  <div
                    key={rel.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      rel.isFlagged
                        ? "bg-red-50 border-red-200"
                        : "bg-background/50 border-border/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-serif font-bold text-primary">
                        {fromNode.name}
                      </span>
                      <div className="flex flex-col items-center">
                        <div className="h-px w-8 bg-foreground/20 relative">
                          <Plus className="w-3 h-3 absolute -top-1.5 left-2.5 text-foreground/40 bg-background" />
                        </div>
                        <span className="text-[8px] font-bold text-foreground/40 mt-1 uppercase tracking-widest">
                          {rel.type.replace("_", " ")}
                        </span>
                      </div>
                      <span className="font-serif font-bold text-primary">
                        {toNode.name}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFlag(rel.id, rel.isFlagged)}
                      className={`p-2 rounded-lg transition-all ${
                        rel.isFlagged
                          ? "bg-red-600 text-white shadow-md shadow-red-200"
                          : "text-foreground/20 hover:text-red-600 hover:bg-red-50"
                      }`}
                      title={
                        rel.isFlagged ? "Uncheck Dispute" : "Report Dispute"
                      }
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {relationships.length === 0 && (
                <p className="text-center py-8 text-foreground/40 italic text-sm">
                  No relationships defined yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <aside className="space-y-6">
          <div className="bg-primary text-background rounded-3xl p-8 shadow-xl">
            <Heart className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-xl font-serif font-bold mb-4">
              Preserving Heritage
            </h3>
            <p className="text-sm leading-relaxed opacity-90 italic">
              "When an elder dies, a library burns to the ground." By mapping
              our roots, we ensure that every branch of the Alor family tree is
              remembered and celebrated.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
              Dispute Guidelines
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-accent">!</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed">
                  Flagged relationships are sent to the{" "}
                  <strong>Council of Elders</strong> for verification.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-accent">!</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed">
                  Avoid adding sensitive information about living relatives
                  without consent.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Add Member Modal */}
      {isAddNodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                Add Family Member
              </h2>
              <form onSubmit={handleCreateNode} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    Member Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newNode.name}
                    onChange={(e) =>
                      setNewNode({ ...newNode, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      Gender
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newNode.gender}
                      onChange={(e) =>
                        setNewNode({ ...newNode, gender: e.target.value })
                      }
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      Birth Year
                    </label>
                    <input
                      type="number"
                      placeholder="1940"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newNode.birthDate}
                      onChange={(e) =>
                        setNewNode({ ...newNode, birthDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddNodeOpen(false)}
                    className="flex-1 py-3 px-6 border border-border rounded-xl font-bold text-foreground/50 hover:bg-foreground/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-primary text-background rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
                  >
                    Plant Node
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Relate Modal */}
      {isRelateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                Define Relationship
              </h2>
              <form onSubmit={handleCreateRel} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    From Member
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newRel.fromId}
                    onChange={(e) =>
                      setNewRel({ ...newRel, fromId: e.target.value })
                    }
                  >
                    <option value="">Select Member</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    To Member
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newRel.toId}
                    onChange={(e) =>
                      setNewRel({ ...newRel, toId: e.target.value })
                    }
                  >
                    <option value="">Select Member</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    Relationship Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newRel.type}
                    onChange={(e) =>
                      setNewRel({ ...newRel, type: e.target.value })
                    }
                  >
                    <option value="PARENT_CHILD">Parent-Child</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="SIBLING">Sibling</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsRelateOpen(false)}
                    className="flex-1 py-3 px-6 border border-border rounded-xl font-bold text-foreground/50 hover:bg-foreground/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-secondary text-background rounded-xl font-bold shadow-lg hover:bg-secondary/90 transition-all"
                  >
                    Link Roots
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
