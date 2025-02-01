import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { parse, serialize } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;
  const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

  const requestBody = await req.json().catch(() => null);
  if (!requestBody) {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }

  const { name, surname, email, phone_number, street_address, postal_code, city, country, confirmPassword } = requestBody;
  const errorsList = [];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      if (!name || !surname || !email || !street_address || !postal_code || !city || !country || !confirmPassword) {
        errorsList.push('Required fields are missing');
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }

      const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });    

      // check if email is already in use by other user
      const user = await prisma.user.findUnique({ where: { email, NOT: { id: decoded.id } } });
      if (user) errorsList.push('Email is already in use');
    
      // check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))errorsList.push('Invalid email');
    
      // check if phone number is valid
      const phoneRegex = /^\d{7,15}$/;  // Allows 7 to 15 digit numbers
      const trimmedPhoneNumber = phone_number.trim();
      if (trimmedPhoneNumber && !phoneRegex.test(trimmedPhoneNumber))errorsList.push('Invalid phone number');
    
      // check if password matched the user one
      if (!currentUser || !(await bcrypt.compare(confirmPassword, currentUser.password))) {
        errorsList.push('Password does not match the current password');
      }
    
      if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
    

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          name,
          surname,
          email,
          phone_number,
          street_address,
          postal_code,
          city,
          country,
        },
      });
    
      if (updatedUser) {

        //generates session  cookies again
        const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, SECRET_KEY, {
          expiresIn: "7d",
        });
    
        const emailToken = jwt.sign({ id: updatedUser.id, email: updatedUser.email }, SECRET_KEY, {
          expiresIn: "7d",
        });
    
        const authToken = setCookieProperties("token", token);
        const emailLogin = setCookieProperties("emailLogin", emailToken);
        const userName = setCookieProperties("userName", `${updatedUser.name} ${updatedUser.surname}`);
    
        const response = new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200, headers: { "Content-Type": "application/json" } });
        response.headers.append("Set-Cookie", authToken);
        response.headers.append("Set-Cookie", emailLogin);
        response.headers.append("Set-Cookie", userName);

        return response
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

function setCookieProperties(name: string, token: string) {
  return serialize(name, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
}