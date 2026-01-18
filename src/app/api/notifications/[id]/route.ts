import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification || notification.userId !== dbUser.id) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!notification || notification.userId !== dbUser.id) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Notification delete error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
