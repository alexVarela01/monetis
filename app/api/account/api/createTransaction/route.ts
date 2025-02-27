import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const availableTypes = [
  "transfer between accounts",
  "transfer",
  "payment",
];

export async function POST(req: Request) {
  try {
    // Extract credentials from headers
    const username = req.headers.get("x-username");
    const password = req.headers.get("x-password");
    
    const requestBody = await req.json().catch(() => null);
    if (!requestBody || !Array.isArray(requestBody)) {
      return new Response(JSON.stringify({ message: "Invalid request. Expected an array of transactions." }), { status: 400 });
    }

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

    const transactions = requestBody.map(({ description, type, amount }) => {
      if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount. It must be a positive number.");
      }

      amount = Math.floor(amount * 100) / 100;

      if (!type || !availableTypes.includes(type)) {
        throw new Error(`Invalid transaction type [${type}]. Allowed types: ${availableTypes.join(", ")}`);
      }

      if (!description || typeof description !== "string" || description.trim().length === 0) {
        throw new Error("Transaction description is required and must be a non-empty string.");
      }

      return {
        user_id: user.id,
        amount: Number(amount),
        type,
        category: description,
      };
    });

    // Add transactions to history
    await prisma.history.createMany({
      data: transactions,
    });

    return new Response(JSON.stringify({ message: 'Transactions added to history' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
