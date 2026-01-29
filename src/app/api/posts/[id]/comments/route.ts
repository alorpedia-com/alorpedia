import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 },
      );
    }

    const comment = await prisma.$transaction(async (tx: any) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: user.id } },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { updatedAt: new Date() },
      });

      return newComment;
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
