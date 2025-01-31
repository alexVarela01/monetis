import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const { account_id } = await req.json();
  const errorsList = [];

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      const userAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, id: Number(account_id) },
      });

      if (!userAccount) errorsList.push('Account not found');
      
      if(errorsList.length > 0) {
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      // delete userAccount
      await prisma.userAccount.deleteMany({
        where: { user_id: decoded.id, id: Number(account_id) },
      });

      // update user balance on checking account
      await prisma.userAccount.updateMany({
        where: { user_id: decoded.id, type: 'checking' },
        data: { amount: { increment: Number(userAccount?.amount) } },
      });

      // add transaction history
      await prisma.history.create({
        data: {
          user_id: decoded.id,
          amount: Number(userAccount?.amount),
          type: 'transfer between accounts',
          category: userAccount?.name + ' to Checking',
        },
      });

      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    }else{
      return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
    }
  }else{
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
  }
}