import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const id = url.searchParams.get("id");

    if (!token || !id) {
      return new Response(JSON.stringify({ error: "Missing token or id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    
    if (typeof decoded !== "string") {
      const userAccount = await getUserAccount(decoded.id, Number(id));

      if (!userAccount) {
        return new Response(JSON.stringify({ error: "Account not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }else{
        return new Response(JSON.stringify({ account: userAccount }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized or Invalid Token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUserAccount(user_id: number, account_id: number) {
  return await prisma.userAccount.findFirst({
    where: { user_id, id: account_id },
  });
}
