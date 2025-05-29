import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    // TO BREAK: Commented out to disable filtering by type and category
    // const type = url.searchParams.get("type");
    // const category = url.searchParams.get("category");
    const type = "All";
    const category = "All";

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
      // Check if the email in the token matches the user's email
      if(typeof decoded !== 'string') {
      const userHistory = await getUserHistory(decoded.id, Number(page), type || "All", category || "All");

        return new Response(JSON.stringify({history: userHistory.data, total: userHistory.total}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else{
      throw new Error("Invalid token");
    }
  } catch (error) {
    // Token is invalid
    return new Response(JSON.stringify({ error: error?.toLocaleString()}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUserHistory(user_id: number, page: number, type: string | undefined, category: string| undefined) {
  type = type === 'All' ? undefined : type?.toString().toLowerCase();
  category = category === 'All' ? undefined : category;

  const userAccounts = await prisma.history.findMany({
    where: { user_id: user_id, type: type, category: category },
    orderBy: { id: 'desc' },
    skip: (page - 1) * 10,
    take: 10,
  });

  const totalCount = await prisma.history.count({
    where: { user_id: user_id, type: type, category: category },
  });

  return {
    data: userAccounts,
    total: totalCount
  };
}