import { parse } from "cookie";

export async function GET(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const accessToken = cookies.token;

  if (!accessToken) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  try {
    return new Response(JSON.stringify({ authenticated: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false, error: error }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}