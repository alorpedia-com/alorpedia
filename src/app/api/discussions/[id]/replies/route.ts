import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: discussionId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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
      if (!session.user || !session.user.email) {
        throw new Error("No user email found in session");
      }

      const newReply = await tx.discussionReply.create({
        data: {
          content,
          discussion: { connect: { id: discussionId } },
          author: { connect: { email: session.user.email } },
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
