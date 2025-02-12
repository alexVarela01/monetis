import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
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