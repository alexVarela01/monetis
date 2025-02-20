import { PrismaClient } from "@prisma/client";
import { generateUniqueIban } from "../../../helper";
import bcrypt from "bcrypt";
import { ibanCodes } from '@/app/api/ibanCodes';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Extract credentials from headers
    const username = req.headers.get("x-username");
    const password = req.headers.get("x-password");
    
    const requestBody = await req.json().catch(() => null);
    if (!requestBody) {
      return new Response(JSON.stringify({ message: "Invalid request. Missing raw request body" }), { status: 400 });
    }

    const { name } = requestBody;
    let { amount } = requestBody;
    amount = Math.floor(amount * 100) / 100;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const errorsList = [];

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: username },
    });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!name || !amount) {
      errorsList.push('Required fields are missing');
    }

    if (name && name.length > 25) {
      errorsList.push('Name must be less than 25 characters');
    }

    // check if amount is a positive and multiple of 10. Minimum should be 10
    if (!/^\d+$/.test(amount) || Number(amount) < 10 || Number(amount) % 10 !== 0) {
      errorsList.push('Amount must be a positive number and multiple of 10');
    }

    //check if checking account has balance
    const checkingAccount = await prisma.userAccount.findFirst({
      where: { user_id: user.id, type: 'checking' },
    });

    if(checkingAccount && Number(checkingAccount.amount) < Number(amount)) {
      errorsList.push('Insufficient balance on checking account');
    }

    // check number of accounts
    const userAccounts = await prisma.userAccount.findMany({
      where: { user_id: user.id },
    });

    if (userAccounts.length >= 6) {
      errorsList.push('Maximum number of accounts reached');
    }

    if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });

    const countryCode = (user?.country && user?.country in ibanCodes) ? user?.country as keyof typeof ibanCodes : "PT";

    const generatedIban = await generateUniqueIban(countryCode);
    const account = await prisma.userAccount.create({
      data: {
        user_id: user.id,
        iban: generatedIban,
        amount: Number(amount),
        name: name,
        type: 'user'
      },
    });

    if (account) {
      // update user balance on checking account
      await prisma.userAccount.updateMany({
        where: { user_id: user.id, type: 'checking' },
        data: { amount: { decrement: Number(amount) } },
      });

      // add transaction history
      await prisma.history.create({
        data: {
          user_id: user.id,
          amount: Number(amount),
          type: 'transfer between accounts',
          category: 'Checking to ' + name,
        },
      });

      return new Response(JSON.stringify({ message: 'Account created successfully' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to create account' }), { status: 500 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
