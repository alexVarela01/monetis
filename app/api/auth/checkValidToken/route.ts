import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, userEmail } = await req.json();
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

      // Check if the email in the token matches the user's email
      if(typeof decoded !== 'string' && decoded.email !== userEmail) {
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
    return new Response(JSON.stringify({ error: error, clearSession: true }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
