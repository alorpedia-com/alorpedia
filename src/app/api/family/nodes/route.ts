import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const nodes = await prisma.familyNode.findMany({
      where: { ownerId: dbUser.id },
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
        OR: [{ from: { ownerId: dbUser.id } }, { to: { ownerId: dbUser.id } }],
      },
    });

    return NextResponse.json({ nodes, relationships });
  } catch (error) {
    console.error("Family fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  const user = authData?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { name, birthDate, gender, userId } = await req.json();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const node = await prisma.familyNode.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender,
        userId,
        ownerId: dbUser.id,
      },
    });

    return NextResponse.json(node, { status: 201 });
  } catch (error) {
    console.error("Node creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
