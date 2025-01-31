import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const { amount, account_id } = await req.json();
  const errorsList = [];

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      const userAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, id: Number(account_id) },
      });

      const checkingAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, type: 'checking' },
      });

      if(!amount) errorsList.push('Required fields are missing');
      if(amount <= 0) errorsList.push('Amount must be greater than 0');
      if(!userAccount) errorsList.push('Account not found');
      if(checkingAccount && checkingAccount.amount < Number(amount)) errorsList.push('Insufficient balance in checking account');
      
      if(errorsList.length > 0) {
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      // update user balance on userAccount
      await prisma.userAccount.updateMany({
        where: { user_id: decoded.id, id: Number(account_id) },
        data: { amount: { increment: Number(amount) } },
      });

      // update user balance on checking account
      await prisma.userAccount.updateMany({
        where: { user_id: decoded.id, type: 'checking' },
        data: { amount: { decrement: Number(amount) } },
      });

      // add transaction history
      await prisma.history.create({
        data: {
          user_id: decoded.id,
          amount: Number(amount),
          type: 'transfer between accounts',
          category: 'Checking to ' + userAccount?.name,
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