import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const requestBody = await req.json().catch(() => null);
  if (!requestBody) {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }

  const { confirmDeletePassword } = requestBody;

  const errorsList = [];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      if (!confirmDeletePassword) {
        errorsList.push('Required fields are missing');
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });    

      // check if password matched the user one
      if (!currentUser || !(await bcrypt.compare(confirmDeletePassword, currentUser.password))) {
        errorsList.push('Password does not match the current password');
      }

      if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });

      //delete userAccount, history and just then the user
      const userAccountDeleted = await prisma.userAccount.deleteMany({
        where: {user_id: currentUser?.id}
      })

      const userHistoryDeleted =await prisma.history.deleteMany({
        where: {user_id: currentUser?.id}
      })

      const userDeleted =await prisma.user.deleteMany({
        where: {id: currentUser?.id}
      })

      if (userAccountDeleted && userHistoryDeleted && userDeleted) {
        return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
      }
    }else{
      return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
    }
  }else{
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 401 });
  }
}