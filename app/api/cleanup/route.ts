import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const apiKey = req.headers.get("API_KEY");

  if (apiKey === process.env.API_KEY) {
    await prisma.userAccount.deleteMany({});
    await prisma.history.deleteMany({});
    await prisma.user.deleteMany({});
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
}
