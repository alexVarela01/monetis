import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { setCookieProperties } from "@/app/utils/helpers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");

    const token = cookies.token;
    const userEmail = cookies.emailLogin;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

      if (userEmail) {
        const emailDecoded = jwt.verify(userEmail, process.env.JWT_SECRET || "your_secret_key");

        // Check if the email in the token matches the user's email
        if(typeof decoded !== 'string' && typeof emailDecoded !== 'string' && decoded.email !== emailDecoded.email) {
          throw new Error("Invalid token");
        }

        if(typeof decoded !== 'string') {
          // check if account still exists
          const user = await prisma.user.findUnique({ where: { id: decoded.id } });
          if (!user) {
            throw new Error("Invalid token");
          }
        }else{
          throw new Error("Invalid token");
        }
      }else{
        throw new Error("Invalid token");
      }

      // Token is valid
      return new Response(JSON.stringify({ message: "Token is valid" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {

    const token = setCookieProperties("token", "");
    const userName = setCookieProperties("userName", "");
    const emailLogin = setCookieProperties("emailLogin", "");
    
    const response = NextResponse.json({error: error?.toLocaleString(), clearSession: true }, { status: 401 });
    response.headers.set("Set-Cookie", token);
    response.headers.append("Set-Cookie", userName);
    response.headers.append("Set-Cookie", emailLogin);
  
    return response;
  }
}