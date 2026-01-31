import { ChevronRight, Users, Trash2 } from "lucide-react";
import Link from "next/link";

interface FamilyNode {
  id: string;
  name: string;
  gender: string;
  userId?: string;
  birthDate?: string;
}

interface Relationship {
  id: string;
  fromId: string;
  toId: string;
  type: string;
  isFlagged: boolean;
  isInferred?: boolean;
}

interface TreeNode extends FamilyNode {
  generation: number;
  x: number;
  y: number;
  children: TreeNode[];
  spouses: TreeNode[];
}

interface TreeVisualizationProps {
  nodes: FamilyNode[];
  relationships: Relationship[];
  onDelete?: (nodeId: string) => void;
  deletingId?: string;
}

export default function TreeVisualization({
  nodes,
  relationships,
  onDelete,
  deletingId,
}: TreeVisualizationProps) {
  // Calculate generational hierarchy
  const buildTree = (): {
    roots: TreeNode[];
    siblingPairs: Array<[TreeNode, TreeNode, boolean]>; // [node1, node2, isInferred]
    inferredSpouseRels: Array<[TreeNode, TreeNode]>;
  } => {
    if (nodes.length === 0)
      return { roots: [], siblingPairs: [], inferredSpouseRels: [] };

    // Find root nodes (nodes with no parents)
    const nodeMap = new Map<string, TreeNode>();
    nodes.forEach((node) => {
      nodeMap.set(node.id, {
        ...node,
        generation: 0,
        x: 0,
        y: 0,
        children: [],
        spouses: [],
      });
    });

    // Parent maps for inference
    const nodeParents = new Map<string, Set<string>>();

    // Build parent-child relationships
    const parentChildRels = relationships.filter(
      (r) => r.type === "PARENT_CHILD",
    );
    const spouseRels = relationships.filter((r) => r.type === "SPOUSE");
    const siblingRels = relationships.filter((r) => r.type === "SIBLING");

    // Track which nodes have parents
    const hasParent = new Set<string>();

    parentChildRels.forEach((rel) => {
      const parent = nodeMap.get(rel.fromId);
      const child = nodeMap.get(rel.toId);
      if (parent && child) {
        parent.children.push(child);
        hasParent.add(child.id);

        // For inference
        if (!nodeParents.has(child.id)) nodeParents.set(child.id, new Set());
        nodeParents.get(child.id)!.add(parent.id);
      }
    });

    // Add explicit spouse relationships
    spouseRels.forEach((rel) => {
      const spouse1 = nodeMap.get(rel.fromId);
      const spouse2 = nodeMap.get(rel.toId);
      if (spouse1 && spouse2) {
        if (!spouse1.spouses.some((s) => s.id === spouse2.id))
          spouse1.spouses.push(spouse2);
        if (!spouse2.spouses.some((s) => s.id === spouse1.id))
          spouse2.spouses.push(spouse1);
      }
    });

    // Infer spouse relationships (polygamy inclusive)
    const inferredSpouseRels: Array<[TreeNode, TreeNode]> = [];
    nodeParents.forEach((parents, childId) => {
      const parentArray = Array.from(parents);
      if (parentArray.length >= 2) {
        for (let i = 0; i < parentArray.length; i++) {
          for (let j = i + 1; j < parentArray.length; j++) {
            const p1 = nodeMap.get(parentArray[i]);
            const p2 = nodeMap.get(parentArray[j]);
            if (p1 && p2) {
              // Check if already exist as explicit spouse
              const alreadyLinked = p1.spouses.some((s) => s.id === p2.id);
              if (!alreadyLinked) {
                p1.spouses.push(p2);
                p2.spouses.push(p1);
                inferredSpouseRels.push([p1, p2]);
              }
            }
          }
        }
      }
    });

    // Explicit sibling relationships
    const siblingPairs: Array<[TreeNode, TreeNode, boolean]> = [];
    siblingRels.forEach((rel) => {
      const sibling1 = nodeMap.get(rel.fromId);
      const sibling2 = nodeMap.get(rel.toId);
      if (sibling1 && sibling2) {
        siblingPairs.push([sibling1, sibling2, false]);
      }
    });

    // Infer sibling relationships
    const processedSiblings = new Set<string>();
    nodeMap.forEach((nodeI) => {
      nodeMap.forEach((nodeJ) => {
        if (nodeI.id === nodeJ.id) return;

        const parentsI = nodeParents.get(nodeI.id);
        const parentsJ = nodeParents.get(nodeJ.id);

        if (parentsI && parentsJ) {
          // Check for common parents
          const hasCommonParent = Array.from(parentsI).some((pId) =>
            parentsJ.has(pId),
          );
          if (hasCommonParent) {
            const pairKey = [nodeI.id, nodeJ.id].sort().join("-");
            if (!processedSiblings.has(pairKey)) {
              // Check if already in siblingPairs (explicit)
              const alreadyLinked = siblingPairs.some(
                (p) =>
                  (p[0].id === nodeI.id && p[1].id === nodeJ.id) ||
                  (p[0].id === nodeJ.id && p[1].id === nodeI.id),
              );
              if (!alreadyLinked) {
                siblingPairs.push([nodeI, nodeJ, true]);
              }
              processedSiblings.add(pairKey);
            }
          }
        }
      });
    });

    // Find root nodes (oldest generation - those without parents)
    const roots = Array.from(nodeMap.values()).filter(
      (node) => !hasParent.has(node.id),
    );

    // Calculate generations recursively
    const calculateGenerations = (node: TreeNode, generation: number) => {
      node.generation = generation;
      node.children.forEach((child) =>
        calculateGenerations(child, generation + 1),
      );
    };

    roots.forEach((root) => calculateGenerations(root, 0));

    return { roots, siblingPairs, inferredSpouseRels };
  };

  // Position nodes in a hierarchical layout
  const positionNodes = (roots: TreeNode[]): TreeNode[] => {
    const HORIZONTAL_SPACING = 200;
    const VERTICAL_SPACING = 150;

    let currentX = 0;

    const positionSubtree = (node: TreeNode, x: number, y: number): number => {
      node.y = y;

      if (node.children.length === 0) {
        node.x = x;
        return x + HORIZONTAL_SPACING;
      }

      // Position children first
      let childX = x;
      node.children.forEach((child) => {
        childX = positionSubtree(child, childX, y + VERTICAL_SPACING);
      });

      // Center parent over children
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;

      return childX;
    };

    roots.forEach((root) => {
      currentX = positionSubtree(root, currentX, 0);
    });

    return roots;
  };

  // Flatten tree for rendering
  const flattenTree = (roots: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    const seen = new Set<string>();

    const visit = (node: TreeNode) => {
      // Use a unique key combining ID and position to handle nodes that appear multiple times
      const uniqueKey = `${node.id}-${node.x}-${node.y}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        result.push(node);
        node.children.forEach(visit);
      }
    };

    roots.forEach(visit);
    return result;
  };

  const { roots: treeRoots, siblingPairs, inferredSpouseRels } = buildTree();
  const positionedRoots = positionNodes(treeRoots);
  const allNodes = flattenTree(positionedRoots);

  // Calculate SVG dimensions
  const minX = Math.min(...allNodes.map((n) => n.x), 0);
  const maxX = Math.max(...allNodes.map((n) => n.x), 400);
  const minY = Math.min(...allNodes.map((n) => n.y), 0);
  const maxY = Math.max(...allNodes.map((n) => n.y), 300);

  const width = maxX - minX + 400;
  const height = maxY - minY + 300;
  const offsetX = -minX + 100;
  const offsetY = -minY + 100;

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center bg-primary/5 border border-dashed border-primary/10 rounded-[2rem] p-12">
        <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/10">
          <Users className="w-12 h-12 text-primary/20" />
        </div>
        <p className="text-primary font-serif italic text-xl max-w-xs leading-relaxed">
          Your family tree is waiting for its first seed. Start by adding your
          parents or grandparents.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-card border border-border/30 rounded-[2rem] p-4 sm:p-8 shadow-inner">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        style={{ minHeight: "400px", maxHeight: "800px" }}
      >
        {/* Draw connecting lines */}
        {allNodes.map((node) =>
          node.children.map((child) => (
            <g key={`${node.id}-${child.id}`}>
              {/* Vertical line from parent */}
              <line
                x1={node.x + offsetX}
                y1={node.y + offsetY + 60}
                x2={node.x + offsetX}
                y2={node.y + offsetY + 110}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
              {/* Horizontal line to children */}
              <line
                x1={Math.min(node.x, child.x) + offsetX}
                y1={node.y + offsetY + 110}
                x2={Math.max(node.x, child.x) + offsetX}
                y2={node.y + offsetY + 110}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
              {/* Vertical line to child */}
              <line
                x1={child.x + offsetX}
                y1={node.y + offsetY + 110}
                x2={child.x + offsetX}
                y2={child.y + offsetY - 10}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/20"
              />
            </g>
          )),
        )}

        {/* Draw spouse connections */}
        {allNodes.map((node) =>
          node.spouses
            .filter((spouse) => allNodes.find((n) => n.id === spouse.id))
            .map((spouse) => {
              const spouseNode = allNodes.find((n) => n.id === spouse.id);
              if (!spouseNode || node.x >= spouseNode.x) return null;

              const isInferred = inferredSpouseRels.some(
                (pair) =>
                  (pair[0].id === node.id && pair[1].id === spouse.id) ||
                  (pair[0].id === spouse.id && pair[1].id === node.id),
              );

              return (
                <line
                  key={`spouse-${node.id}-${spouse.id}`}
                  x1={node.x + offsetX + 80}
                  y1={node.y + offsetY + 30}
                  x2={spouseNode.x + offsetX - 80}
                  y2={spouseNode.y + offsetY + 30}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={isInferred ? "2 2" : "4 4"}
                  className={isInferred ? "text-accent/50" : "text-accent/30"}
                />
              );
            }),
        )}

        {/* Draw sibling connections */}
        {siblingPairs.map(([sibling1, sibling2, isInferred], index) => {
          // Find positioned nodes
          const node1 = allNodes.find((n) => n.id === sibling1.id);
          const node2 = allNodes.find((n) => n.id === sibling2.id);

          if (!node1 || !node2) return null;

          // Only draw once (from left to right)
          if (node1.x >= node2.x) return null;

          // Draw a curved line connecting siblings
          const midY = Math.min(node1.y, node2.y) + offsetY - 20;
          const pathData = `
            M ${node1.x + offsetX + 80} ${node1.y + offsetY}
            Q ${node1.x + offsetX + 80} ${midY},
              ${(node1.x + node2.x) / 2 + offsetX} ${midY}
            Q ${node2.x + offsetX - 80} ${midY},
              ${node2.x + offsetX - 80} ${node2.y + offsetY}
          `;

          return (
            <path
              key={`sibling-${node1.id}-${node2.id}-${index}`}
              d={pathData}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={isInferred ? "1 2" : "2 3"}
              fill="none"
              className={isInferred ? "text-secondary/50" : "text-secondary/30"}
            />
          );
        })}

        {/* Render nodes */}
        {allNodes.map((node, index) => {
          const NodeWrapper = node.userId ? "a" : "div";
          const wrapperProps = node.userId
            ? { href: `/profile/${node.userId}` }
            : {};

          const isDeleting = deletingId === node.id;

          return (
            <foreignObject
              key={`node-${node.id}-${node.x}-${node.y}`}
              x={node.x + offsetX - 80}
              y={node.y + offsetY - 30}
              width="160"
              height="150"
            >
              <div
                className={`group relative p-4 rounded-2xl border-2 transition-all ${
                  node.userId
                    ? "border-primary/20 bg-primary/5 shadow-inner cursor-pointer hover:shadow-xl hover:scale-105"
                    : "border-border/30 bg-card shadow-sm cursor-default"
                } ${isDeleting ? "opacity-40 grayscale pointer-events-none" : ""}`}
              >
                {/* Delete Button - only visible on hover (or during deletion) */}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(node.id);
                    }}
                    disabled={!!deletingId}
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg z-20 ${
                      isDeleting
                        ? "bg-red-500 text-white opacity-100"
                        : "bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600"
                    }`}
                    title="Delete Member"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}

                <NodeWrapper {...wrapperProps} className="block text-center">
                  <h3 className="font-serif font-bold text-primary text-sm mb-1 truncate">
                    {node.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-[8px] uppercase font-black tracking-widest text-foreground/30 px-1.5 py-0.5 rounded bg-foreground/5">
                      {node.gender}
                    </span>
                    {node.userId && (
                      <span className="bg-primary text-background text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                        Linked
                      </span>
                    )}
                  </div>
                  {node.userId && (
                    <div className="mt-2 flex justify-center">
                      <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  )}
                </NodeWrapper>
              </div>
            </foreignObject>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-primary/20" />
          <span className="text-foreground/60 font-medium">Parent-Child</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-accent/30 border-dashed border-t-2 border-accent/30" />
          <span className="text-foreground/60 font-medium">Spouse</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg width="32" height="4" className="text-secondary/30">
            <line
              x1="0"
              y1="2"
              x2="32"
              y2="2"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="2 3"
            />
          </svg>
          <span className="text-foreground/60 font-medium">Sibling</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-0.5 border-t border-accent/50 border-dotted" />
          <span className="text-foreground/40 font-medium italic">
            Inferred Spouse
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-0.5 border-t border-secondary/50 border-dotted" />
          <span className="text-foreground/40 font-medium italic">
            Inferred Sibling
          </span>
        </div>
      </div>
    </div>
  );
}
