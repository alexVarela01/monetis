import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const { newName, account_id } = await req.json();
  const errorsList = [];

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      const userAccount = await prisma.userAccount.findFirst({
        where: { user_id: decoded.id, id: Number(account_id) },
      });

      if (!userAccount) errorsList.push('Account not found');
      else if (userAccount.type === 'checking' || userAccount.type === 'savings') errorsList.push('Cannot edit this account');
      
      if (!newName) errorsList.push('Required fields are missing');
      
      if (newName.length > 25) {
        errorsList.push('Name must be less than 25 characters');
      }

      if(errorsList.length > 0) {
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      await prisma.userAccount.update({
        where: { id: Number(account_id) },
        data: { name: newName },
      });

      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    }else{
      return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
    }
  }else{
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
  }
}