import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
      // Check if the email in the token matches the user's email
      if(typeof decoded !== 'string') {
        const user = await getUserData(decoded.id);

        return new Response(JSON.stringify({user: user}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else{
      throw new Error("Invalid token");
    }
  } catch (error) {
    // Token is invalid
    return new Response(JSON.stringify({ error: error?.toLocaleString()}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUserData(user_id: number) {
  // withoutPassword
  const userAccounts = await prisma.user.findFirst({
    where: { id: user_id },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      phone_number: true,
      street_address: true,
      postal_code: true,
      city: true,
      country: true,
      password: false
    }
    
  });

  return userAccounts;
}