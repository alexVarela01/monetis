import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
      // Check if the email in the token matches the user's email
      if(typeof decoded !== 'string') {
        const userAccounts = await getUserAccounts(decoded.id);
        const userHistory = await getUserHistory(decoded.id);
        const userHistoryCategoryAmountCount = await getUserHistoryCategoryAmount(decoded.id);

        console.log(userHistoryCategoryAmountCount);
        
        return new Response(JSON.stringify({accounts: userAccounts, history: userHistory, historyCategoryAmountCount: userHistoryCategoryAmountCount}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } 
  } catch (error) {
    // Token is invalid
    return new Response(JSON.stringify({ error: error}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUserAccounts(user_id: number) {
  const userAccounts = await prisma.userAccount.findMany({
    where: { user_id: user_id },
    orderBy: { id: 'asc' },
  });

  return userAccounts;
}

async function getUserHistory(user_id: number) {
  const userAccounts = await prisma.history.findMany({
    where: { user_id: user_id },
    orderBy: { id: 'desc' },
  });

  return userAccounts;
}

async function getUserHistoryCategoryAmount(user_id: number) {
  // get total amount for each category and include type
  const categories = await prisma.history.groupBy({
      by: ['category', 'type'],
      where: { user_id: user_id },
      _sum: { amount: true },
      _count: { id: true },
    })

  return categories;
}