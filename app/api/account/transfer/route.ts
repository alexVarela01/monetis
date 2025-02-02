import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const requestBody = await req.json().catch(() => null);
  if (!requestBody) {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }

  const { account_id, iban } = requestBody;
  let { amount } = requestBody;

  amount = Math.floor(amount * 100) / 100;
  const errorsList = [];

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      const selectedAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, id: Number(account_id)},
      })

      if(!amount) errorsList.push('Required fields are missing');
      if(amount <= 0) errorsList.push('Amount must be greater than 0');
      if(!selectedAccount) errorsList.push('Account not found');
      if(selectedAccount && selectedAccount.amount < Number(amount)) errorsList.push('Insufficient balance in this account');
      
      if(errorsList.length > 0) {
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      // update user balance on IBAN
      await prisma.userAccount.updateMany({
        where: { iban: iban },
        data: { amount: { increment: Number(amount) } },
      });

      // update user balance on userAccount
      await prisma.userAccount.updateMany({
        where: { user_id: decoded.id, id: Number(account_id) },
        data: { amount: { decrement: Number(amount) } },
      });
      
      // get user with account that has iban. Iban comes from userAccount
      const user = await prisma.user.findFirst({
        where: { accounts: { some: { iban: iban } } },
      })

      // add transaction history
      await prisma.history.create({
        data: {
          user_id: decoded.id,
          amount: -Number(amount),
          type: 'transfer',
          category: "To " + iban,
        },
      });

      if(user) {
        // add transaction history
        await prisma.history.create({
          data: {
            user_id: user.id,
            amount: Number(amount),
            type: 'transfer',
            category: "From " + selectedAccount?.iban,
          },
        });
      }

      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    }else{
      return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
    }
  }else{
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
  }
}