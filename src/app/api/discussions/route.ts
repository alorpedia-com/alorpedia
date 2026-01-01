import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const village = searchParams.get("village");

  try {
    const discussions = await prisma.discussion.findMany({
      where: village && village !== "All" ? { village } : {},
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            village: true,
            ageGrade: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error("Discussions fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content, village } = await req.json();

    if (!title || !content || !village) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        village,
        author: {
          connect: { email: session.user.email! },
        },
      },
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error("Discussion creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
