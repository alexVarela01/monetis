import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const availableTypes =[
  "transfer between accounts",
  "transfer",
  "payment",
]

export async function POST(req: Request) {
  try {
    // Extract credentials from headers
    const username = req.headers.get("x-username");
    const password = req.headers.get("x-password");
    
    const requestBody = await req.json().catch(() => null);
    if (!requestBody) {
      return new Response(JSON.stringify({ message: "Invalid request. Missing raw request body" }), { status: 400 });
    }

    const { description, type } = requestBody;
    let { amount } = requestBody;
    amount = Math.floor(amount * 100) / 100;

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

    if (type && !availableTypes.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid transaction type [" + availableTypes+"]" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else if (!type) {
      return new Response(JSON.stringify({ error: "Transaction type is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!description) {
      return new Response(JSON.stringify({ error: "Transaction description is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // add transaction history
    await prisma.history.create({
      data: {
        user_id: user.id,
        amount: Number(amount),
        type: type,
        category: description,
      },
    });

    return new Response(JSON.stringify({ message: 'Transaction added to history' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
