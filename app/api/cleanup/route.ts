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
    const protectedEmails = getEmailsList();

    // Find all protected users based on their emails
    const protectedUsers = await prisma.user.findMany({
      where: {
        email: { in: protectedEmails },
      },
    });

    // Extract the IDs of the protected users
    const protectedUserIds = protectedUsers.map(user => user.id);

    // Deleting all data except related to protected users
    await prisma.$transaction([
      prisma.userAccount.deleteMany({
        where: {
          user_id: { notIn: protectedUserIds },
        },
      }),
      prisma.history.deleteMany({
        where: {
          user_id: { notIn: protectedUserIds },
        },
      }),
      prisma.user.deleteMany({
        where: {
          id: { notIn: protectedUserIds },
        },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Database cleanup failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function getEmailsList() {
  const emails = process.env.BYPASS_EMAILS; // Retrieve the BYPASS_EMAILS variable
  if (!emails) {
      return []; // Return an empty array if the variable is not found
  }
  return emails.split(','); // Split the string by commas to get the list
}