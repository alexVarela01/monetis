import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    const emailToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    const authToken = setCookieProperties("token", token);
    const emailLogin = setCookieProperties("emailLogin", emailToken);
    const userName = setCookieProperties("userName", `${user.name} ${user.surname}`);

    const response = new Response(JSON.stringify({ token, userName }), { status: 200, headers: { "Content-Type": "application/json" } });
    response.headers.append("Set-Cookie", authToken);
    response.headers.append("Set-Cookie", emailLogin);
    response.headers.append("Set-Cookie", userName);
    
    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function setCookieProperties(name: string, token: string) {
  return serialize(name, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
}