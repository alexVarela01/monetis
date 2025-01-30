import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const id = url.searchParams.get("id");

    if (!token || !id) {
      return new Response(JSON.stringify({ error: "Missing token or id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    
    if (typeof decoded !== "string") {
      const userAccount = await getUserAccount(decoded.id, Number(id));
      const totalBalance = await getTotalBalance(decoded.id);

      if (!userAccount) {
        return new Response(JSON.stringify({ error: "Account not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }else{
        return new Response(JSON.stringify({ account: userAccount.account, index: userAccount.index, totalBalance: totalBalance }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized or Invalid Token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUserAccount(user_id: number, account_id: number) {
  const accounts = await prisma.userAccount.findMany({
    where: { user_id },
    orderBy: { id: 'asc' }, // Ensure consistent ordering
  });

  const index = accounts.findIndex(account => account.id === account_id);
  let account = accounts[index];
  return index !== -1 ? { account: accounts[index], index } : null; // Return null if not found
}


async function getTotalBalance(user_id: number) {
  return await prisma.userAccount.aggregate({
    where: { user_id },
    _sum: { amount: true },
  })
}