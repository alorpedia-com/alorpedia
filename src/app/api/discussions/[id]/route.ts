import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            village: true,
            ageGrade: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                name: true,
                village: true,
                ageGrade: true,
              },
            },
          },
        },
      },
    });

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(discussion);
  } catch (error) {
    console.error("Discussion fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id },
    });

    if (!discussion) {
      return NextResponse.json(
        { message: "Discussion not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || discussion.authorId !== dbUser.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await prisma.discussion.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Discussion deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
