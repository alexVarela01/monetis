import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
  
    const { amount } = requestBody;

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    if(amount <= 0) return new Response(JSON.stringify({ error: "Amount must be greater than 0" }), {status: 401, headers: { "Content-Type": "application/json" }});

    // Update user balance
    await prisma.userAccount.updateMany({
      where: { user_id: user.id, type: "checking" },
      data: { amount: { increment: amount } },
    });
    
    // add transaction history
    await prisma.history.create({
      data: {
        user_id: user.id,
        amount: Number(amount),
        type: 'transfer',
        category: 'Salary',
      },
    });

    return new Response(JSON.stringify({ message: "Salary added successfully to your account", userId: user.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
