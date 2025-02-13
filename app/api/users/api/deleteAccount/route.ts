import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    // Extract credentials from headers
    const username = req.headers.get("x-username");
    const password = req.headers.get("x-password");
    
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

    //delete userAccount, history and just then the user
    const userAccountDeleted = await prisma.userAccount.deleteMany({
      where: {user_id: user?.id}
    })

    const userHistoryDeleted =await prisma.history.deleteMany({
      where: {user_id: user?.id}
    })

    const userDeleted =await prisma.user.deleteMany({
      where: {id: user?.id}
    })

    if (userAccountDeleted && userHistoryDeleted && userDeleted) {
      return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error?.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
