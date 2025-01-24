import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure to set this in environment variables

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user by email and password
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (user) {
      // Create JWT payload
      const payload = {
        id: user.id,
        email: user.email,
      };

      // Generate JWT token
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
      const userName = user.name + " " + user.surname;
      
      return new Response(
        JSON.stringify({ message: "Login successful", token, userName }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
