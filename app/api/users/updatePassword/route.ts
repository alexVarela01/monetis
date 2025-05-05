import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  const requestBody = await req.json().catch(() => null);
  if (!requestBody) {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
  }

  const { oldPassword, newPassword, confirmNewPassword } = requestBody;
  const errorsList = [];
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    if(typeof decoded !== 'string') {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        errorsList.push('Required fields are missing');
        return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
      }
      
      // TO BREAK: Currently commented to disable old password validation
      // const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });    

      // check if password matched the user one
      // if (!currentUser || !(await bcrypt.compare(oldPassword, currentUser.password))) {
      //   errorsList.push('Password does not match the current password');
      // }

      // check if password is strong
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+=#^()\-])[A-Za-z\d@$!%*?&+=#^()\-]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        errorsList.push('Password must contain at least 8 characters, including one letter, one number, and one of the following special characters: @$!%*?&+=#^()-');
      }
      
      // check if password and confirmPassword match
      if (newPassword !== confirmNewPassword)errorsList.push('New passwords do not match');
    
      if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });
    
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          password: hashedPassword
        },
      });
    
      if (updatedUser) {
        return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
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