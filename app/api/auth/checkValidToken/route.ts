import jwt from "jsonwebtoken";
import { parse } from "cookie";

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
    // Token is invalid
    return new Response(JSON.stringify({ error: error?.toLocaleString(), clearSession: true }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
