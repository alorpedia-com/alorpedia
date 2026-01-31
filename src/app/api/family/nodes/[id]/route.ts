import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      console.warn(
        `User ${user.id} not found in database during deletion of node ${id}`,
      );
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure the node belongs to the user
    const node = await prisma.familyNode.findFirst({
      where: {
        id,
        ownerId: dbUser.id,
      },
    });

    if (!node) {
      console.warn(`Node ${id} not found or not owned by user ${dbUser.id}`);
      return NextResponse.json(
        { message: "Node not found or not owned by user" },
        { status: 404 },
      );
    }

    // Delete relationships involving this node first
    await prisma.relationship.deleteMany({
      where: {
        OR: [{ fromId: id }, { toId: id }],
      },
    });

    await prisma.familyNode.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Node deleted successfully" });
  } catch (error) {
    console.error("Node deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
