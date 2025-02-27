import { NextResponse } from "next/server";
import { setCookieProperties } from "@/app/utils/helpers";

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