import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: discussionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Reply content is required" },
        { status: 400 }
      );
    }

    const reply = await prisma.$transaction(async (tx: any) => {
      const newReply = await tx.discussionReply.create({
        data: {
          content,
          discussion: { connect: { id: discussionId } },
          author: { connect: { id: user.id } },
        },
      });

      await tx.discussion.update({
        where: { id: discussionId },
        data: { updatedAt: new Date() },
      });

      return newReply;
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Reply creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
