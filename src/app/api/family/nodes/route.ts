import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const nodes = await prisma.familyNode.findMany({
      where: { ownerId: user.id },
      include: {
        user: {
          select: {
            name: true,
            village: true,
            ageGrade: true,
          },
        },
      },
    });

    const relationships = await prisma.relationship.findMany({
      where: {
        OR: [{ from: { ownerId: user.id } }, { to: { ownerId: user.id } }],
      },
    });

    return NextResponse.json({ nodes, relationships });
  } catch (error) {
    console.error("Family fetch error:", error);
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
    const { name, birthDate, gender, userId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const node = await prisma.familyNode.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        userId,
        ownerId: user.id,
      },
    });

    return NextResponse.json(node, { status: 201 });
  } catch (error) {
    console.error("Node creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
