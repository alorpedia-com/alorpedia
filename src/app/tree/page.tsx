"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  GitBranch,
  Plus,
  UserPlus,
  ShieldAlert,
  Shield,
  Trash2,
  Heart,
  Users,
  ChevronRight,
  Search,
} from "lucide-react";
import TreeOnboardingModal from "@/components/TreeOnboardingModal";
import TreeVisualization from "@/components/TreeVisualization";

export default function TreeOfLife() {
  const { data: session } = useSession();
  const [nodes, setNodes] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isRelateOpen, setIsRelateOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "tree">("tree"); // Default to tree view

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

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("tree_onboarding_seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem("tree_onboarding_seen", "true");
    setShowOnboarding(false);
  };

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
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-native py-native bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20 gap-8">
        <div className="space-y-4">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold md:font-bold text-primary leading-tight tracking-tight">
            Osisi Ndụ
          </h1>
          <p className="text-xs md:text-lg sm:text-xl text-foreground/70 max-w-2xl font-normal md:font-medium italic border-l-4 border-primary/20 pl-6 py-2">
            "The Tree of Life." Map your lineage, preserve your roots, and
            connect with the living branches of your family.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center justify-center space-x-3 bg-accent/10 text-accent px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent/20 transition-all border border-accent/20 active:scale-95"
            title="Show Tutorial"
          >
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">Tutorial</span>
          </button>
          <button
            onClick={() => setIsAddNodeOpen(true)}
            className="flex items-center justify-center space-x-3 bg-primary text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Member</span>
          </button>
          <button
            onClick={() => setIsRelateOpen(true)}
            className="flex items-center justify-center space-x-3 bg-secondary text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary/90 transition-all shadow-xl active:scale-95"
          >
            <GitBranch className="w-5 h-5" />
            <span>Link Roots</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
        {/* Connection visualization / Tree Structure */}
        <div className="lg:col-span-2 space-y-12 sm:space-y-16">
          <div className="card-premium p-8 sm:p-12 min-h-[500px] border-none shadow-2xl relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] group-hover:scale-110 transition-transform duration-[10s] ease-linear" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Ancestral Branches</span>
                </h2>

                {/* View Toggle */}
                <div className="flex items-center space-x-2 bg-primary/5 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("tree")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      viewMode === "tree"
                        ? "bg-primary text-background shadow-lg"
                        : "text-primary/40 hover:text-primary"
                    }`}
                  >
                    Tree
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      viewMode === "grid"
                        ? "bg-primary text-background shadow-lg"
                        : "text-primary/40 hover:text-primary"
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              {nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/10">
                    <GitBranch className="w-12 h-12 text-primary/20" />
                  </div>
                  <p className="text-primary font-serif italic text-xl max-w-xs leading-relaxed">
                    Your family tree is waiting for its first seed. Start by
                    adding your parents or grandparents.
                  </p>
                </div>
              ) : viewMode === "tree" ? (
                <TreeVisualization
                  nodes={nodes}
                  relationships={relationships}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {nodes.map((node) => {
                    const NodeWrapper = node.userId ? "a" : "div";
                    const wrapperProps = node.userId
                      ? { href: `/profile/${node.userId}` }
                      : {};

                    return (
                      <NodeWrapper
                        key={node.id}
                        {...wrapperProps}
                        className={`p-6 sm:p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group/node ${
                          node.userId
                            ? "border-primary/20 bg-primary/5 shadow-inner cursor-pointer hover:shadow-xl active:scale-95"
                            : "border-border/30 bg-card shadow-sm cursor-default opacity-75"
                        }`}
                      >
                        <div className="space-y-2">
                          <h3 className="font-serif font-bold text-primary text-xl">
                            {node.name}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-[9px] uppercase font-black tracking-widest text-foreground/30 px-2 py-0.5 rounded-lg bg-foreground/5 border border-border/20">
                              {node.gender}
                            </span>
                            {node.userId && (
                              <span className="bg-primary text-background text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                                Linked
                              </span>
                            )}
                          </div>
                        </div>
                        {node.userId && (
                          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center group-hover/node:bg-primary group-hover/node:text-background transition-all">
                            <ChevronRight className="w-5 h-5 transition-transform group-hover/node:translate-x-1" />
                          </div>
                        )}
                      </NodeWrapper>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Relationships List / Disputes */}
          <div className="card-premium p-6 sm:p-8 lg:p-12 border-none shadow-xl">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-6 sm:mb-8 lg:mb-12 flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/5 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-accent" />
              </div>
              <span>Relationship Records</span>
            </h2>

            {/* Scrollable container */}
            <div className="max-h-[600px] overflow-y-auto pr-2 -mr-2">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                {relationships.map((rel) => {
                  const fromNode = nodes.find((n) => n.id === rel.fromId);
                  const toNode = nodes.find((n) => n.id === rel.toId);
                  if (!fromNode || !toNode) return null;

                  return (
                    <div
                      key={rel.id}
                      className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all gap-4 sm:gap-6 ${
                        rel.isFlagged
                          ? "bg-red-50/50 border-red-100 shadow-inner"
                          : "bg-background/50 border-border/30 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                        <div className="text-center">
                          <span className="block font-serif font-bold text-primary text-base sm:text-lg">
                            {fromNode.name}
                          </span>
                          <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest italic">
                            Branch A
                          </span>
                        </div>
                        <div className="flex flex-col items-center shrink-0">
                          <div className="h-px w-12 bg-primary/20 relative">
                            <div className="w-2 h-2 rounded-full bg-primary absolute -top-[3.5px] -left-1 shadow-lg" />
                            <div className="w-2 h-2 rounded-full bg-primary absolute -top-[3.5px] -right-1 shadow-lg" />
                            <Plus className="w-4 h-4 absolute -top-2 left-4 text-primary bg-background rounded-full border border-primary/10" />
                          </div>
                          <span className="text-[9px] font-black text-primary mt-3 uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-lg whitespace-nowrap">
                            {rel.type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block font-serif font-bold text-primary text-base sm:text-lg">
                            {toNode.name}
                          </span>
                          <span className="text-[8px] font-black text-foreground/30 uppercase tracking-widest italic">
                            Branch B
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFlag(rel.id, rel.isFlagged)}
                        className={`w-full sm:w-auto px-4 py-3 sm:p-4 rounded-xl transition-all flex items-center justify-center space-x-2 sm:space-x-3 ${
                          rel.isFlagged
                            ? "bg-red-600 text-white shadow-xl shadow-red-200 active:scale-95"
                            : "text-foreground/20 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                        }`}
                        title={
                          rel.isFlagged ? "Uncheck Dispute" : "Report Dispute"
                        }
                      >
                        <ShieldAlert className="w-5 h-5" />
                        <span className="font-black uppercase tracking-widest text-[10px]">
                          {rel.isFlagged ? "Dispute Active" : "Report Issue"}
                        </span>
                      </button>
                    </div>
                  );
                })}
                {relationships.length === 0 && (
                  <div className="text-center py-16 sm:py-20 bg-primary/5 border border-dashed border-primary/10 rounded-[2rem] opacity-50">
                    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <GitBranch className="w-8 h-8 text-primary/20" />
                    </div>
                    <p className="text-primary font-serif italic text-lg">
                      No relationships have been defined yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <aside className="space-y-8">
          <div className="bg-primary text-background rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/20 transition-all duration-1000" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-background/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-background/10">
                <Heart className="w-8 h-8 text-accent shadow-xl" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6 tracking-tight">
                Preserving <br />
                Heritage
              </h3>
              <p className="text-base leading-relaxed opacity-80 italic font-medium border-l-2 border-accent/30 pl-6 py-1">
                "When an elder dies, a library burns to the ground." By mapping
                our roots, we ensure that every branch of the Alor family tree
                is remembered and celebrated.
              </p>
            </div>
          </div>

          <div className="card-premium p-10 border-none shadow-xl bg-accent/5 backdrop-blur-sm">
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-8 flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3" />
              </div>
              <span>Dispute Guidelines</span>
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group/item">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                  <span className="text-[10px] font-black text-accent">!</span>
                </div>
                <p className="text-[12px] text-foreground/50 leading-relaxed font-bold uppercase tracking-widest italic">
                  Flagged links are reviewed by the{" "}
                  <span className="text-accent underline decoration-accent/30">
                    Council of Elders
                  </span>
                  .
                </p>
              </li>
              <li className="flex items-start space-x-4 group/item">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                  <span className="text-[10px] font-black text-accent">!</span>
                </div>
                <p className="text-[12px] text-foreground/50 leading-relaxed font-bold uppercase tracking-widest italic">
                  Keep lineage details{" "}
                  <span className="text-primary font-black not-italic">
                    accurate & respectful
                  </span>
                  .
                </p>
              </li>
            </ul>
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
                    <optgroup label="Extended Family">
                      <option value="GRANDPARENT_GRANDCHILD">
                        Grandparent-Grandchild
                      </option>
                      <option value="AUNT_UNCLE_NIECE_NEPHEW">
                        Aunt/Uncle-Niece/Nephew
                      </option>
                      <option value="COUSIN">Cousin</option>
                    </optgroup>
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

      {/* Onboarding Modal */}
      {showOnboarding && (
        <TreeOnboardingModal onClose={handleCloseOnboarding} />
      )}
    </div>
  );
}
