import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("API_KEY");

  if (!apiKey || apiKey !== process.env.CLEANUP_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$transaction([
      prisma.userAccount.deleteMany({}),
      prisma.history.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Database cleanup failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
