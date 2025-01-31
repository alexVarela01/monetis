import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const token = setCookieProperties("token", "");
  const userName = setCookieProperties("userName", "");
  const emailLogin = setCookieProperties("emailLogin", "");

  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.headers.set("Set-Cookie", token);
  response.headers.append("Set-Cookie", userName);
  response.headers.append("Set-Cookie", emailLogin);

  return response;
}

function setCookieProperties(name: string, token: string) {
  return serialize(name, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    expires: new Date(0), // Expire the cookie
  });
}