import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {

    // Extract credentials from headers
    const username = req.headers.get("x-username");
    const password = req.headers.get("x-password");

    const url = new URL(req.url);
    const targetEmail = url.searchParams.get("email");


    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!targetEmail) {
      return new Response(JSON.stringify({ error: "Missing target email" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user exists
    const myUser = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!myUser) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, myUser.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }


    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Could not find user with provided email" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const targetUserAccounts = await prisma.userAccount.findMany({
      where: {
        user_id: user.id,
      }
    })

    if(!targetUserAccounts) { 
      return new Response(JSON.stringify({ error: "Could not find checking account for user" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mappedAccounts = targetUserAccounts.map((account) => {
      return {
        name: account.name,
        type: account.type,
        iban: account.iban
      }
    })

    return new Response(JSON.stringify({ mappedAccounts }), {
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
