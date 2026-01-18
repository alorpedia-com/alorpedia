import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { fromId, toId, type } = await req.json();

    if (!fromId || !toId || !type) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const relationship = await prisma.relationship.create({
      data: {
        fromId,
        toId,
        type,
      },
    });

    return NextResponse.json(relationship, { status: 201 });
  } catch (error) {
    console.error("Relationship creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
