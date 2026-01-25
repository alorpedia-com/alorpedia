import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const village = searchParams.get("village");
  const ageGrade = searchParams.get("ageGrade");

  try {
    const where: any = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };

    if (village && village !== "All") {
      where.village = village;
    }

    if (ageGrade && ageGrade !== "All") {
      where.ageGrade = ageGrade;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        village: true,
        ageGrade: true,
        profileImage: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });

    // Get all unique age grades for the filter
    const allUsers = await prisma.user.findMany({
      select: { ageGrade: true },
      distinct: ["ageGrade"],
    });
    const allAgeGrades = allUsers
      .map((u: { ageGrade: any }) => u.ageGrade)
      .sort();

    return NextResponse.json({ users, allAgeGrades });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
