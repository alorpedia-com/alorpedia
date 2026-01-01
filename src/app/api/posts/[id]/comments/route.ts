import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.$transaction(async (tx: any) => {
      if (!session.user || !session.user.email) {
        throw new Error("No user email found in session");
      }

      const newComment = await tx.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { email: session.user.email } },
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
      { status: 500 }
    );
  }
}
