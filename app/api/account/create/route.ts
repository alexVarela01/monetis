import { PrismaClient } from "@prisma/client";
import { generateUniqueIban } from "../../helper";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();



export async function POST(req: Request) {

  const { formData, token } = await req.json();
  const { name, amount } = formData;

  const errorsList = [];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {

      if (!name || !amount) {
        errorsList.push('Required fields are missing');
      }

      if (name.length > 15) {
        errorsList.push('Name must be less than 15 characters');
      }

      if(name === 'Checking' || name === 'Savings') {
        errorsList.push('Invalid account name');
      }

      // check if amount is a positive and multiple of 10. Minimum should be 10
      if (!/^\d+$/.test(amount) || Number(amount) < 10 || Number(amount) % 10 !== 0) {
        errorsList.push('Amount must be a positive number and multiple of 10');
      }

      //check if checking account has balance
      const checkingAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, name: 'Checking' },
      });

      if(checkingAccount && Number(checkingAccount.amount) < Number(amount)) {
        errorsList.push('Insufficient balance on checking account');
      }

      if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });

      const generatedIban = await generateUniqueIban();
      const account = await prisma.userAccount.create({
        data: {
          user_id: decoded.id,
          iban: generatedIban,
          amount: Number(amount),
          name: name,
        },
      });

      if (account) {
        // update user balance on checking account
        await prisma.userAccount.updateMany({
          where: { user_id: decoded.id, name: 'Checking' },
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