import { PrismaClient } from "@prisma/client";
import { generateUniqueIban } from "../../helper";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { ibanCodes } from '@/app/api/ibanCodes';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const requestBody = await req.json().catch(() => null);
  if (!requestBody) {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }

  const { formData } = requestBody;
  const { name } = formData;
  let { amount } = formData;
  amount = Math.floor(amount * 100) / 100;

  const errorsList = [];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {

      if (!name || !amount) {
        errorsList.push('Required fields are missing');
      }

      if (name.length > 25) {
        errorsList.push('Name must be less than 25 characters');
      }

      // check if amount is a positive and multiple of 10. Minimum should be 10
      if (!/^\d+$/.test(amount) || Number(amount) < 10 || Number(amount) % 10 !== 0) {
        errorsList.push('Amount must be a positive number and multiple of 10');
      }

      //check if checking account has balance
      const checkingAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, type: 'checking' },
      });

      if(checkingAccount && Number(checkingAccount.amount) < Number(amount)) {
        errorsList.push('Insufficient balance on checking account');
      }

      if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });

      const user = await prisma.user.findUnique({where: { id: decoded.id }});
      const countryCode = (user?.country && user?.country in ibanCodes) ? user?.country as keyof typeof ibanCodes : "PT";

      const generatedIban = await generateUniqueIban(countryCode);
      const account = await prisma.userAccount.create({
        data: {
          user_id: decoded.id,
          iban: generatedIban,
          amount: Number(amount),
          name: name,
          type: 'user'
        },
      });

      if (account) {
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
            category: 'Checking to ' + name,
          },
        });

        return new Response(JSON.stringify({ message: 'Account created successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Failed to create account' }), { status: 500 });
      }
    }else{
      return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
    }
  }else{
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
  }
}