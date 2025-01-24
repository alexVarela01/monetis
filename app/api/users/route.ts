import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(req: Request) {
  const { name, surname, email, phone_number, street_address, postal_code, city, state, country, password } = await req.json();
  const newUser = await prisma.user.create({
    data: {
      name, surname, email, phone_number, street_address, postal_code, city, state, country, password,
    },
  });
  return new Response(JSON.stringify(newUser), { status: 201 });
}