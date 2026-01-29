import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            village: true,
            ageGrade: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                name: true,
                ageGrade: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content, type, imageUrl } = await req.json();

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if user is the author
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || post.authorId !== dbUser.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, type, imageUrl },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if user is the author
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || post.authorId !== dbUser.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
