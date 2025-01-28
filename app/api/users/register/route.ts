import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(req: Request) {
  const { name, surname, email, phone_number, street_address, postal_code, city, country, password, confirmPassword } = await req.json();
  const errorsList = [];

  if (!name || !surname || !email || !street_address || !postal_code || !city || !country || !password) {
    errorsList.push('Required fields are missing');
  }

  // check if email is already in use
  const user = await prisma.user.findUnique({where: { email }});
  if (user) errorsList.push('Email is already in use');

  // check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))errorsList.push('Invalid email');

  // check if phone number is valid
  const phoneRegex = /^\d{7,15}$/;  // Allows 7 to 15 digit numbers
  const trimmedPhoneNumber = phone_number.trim();
  if (trimmedPhoneNumber && !phoneRegex.test(trimmedPhoneNumber))errorsList.push('Invalid phone number');

  // check if password is strong
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+=#^()\-])[A-Za-z\d@$!%*?&+=#^()\-]{8,}$/;
  if (!passwordRegex.test(password)) {
    errorsList.push('Password must contain at least 8 characters, including one letter, one number, and one of the following special characters: @$!%*?&+=#^()-');
  }
  
  // check if password and confirmPassword match
  if (password !== confirmPassword)errorsList.push('Passwords do not match');

  if (errorsList.length > 0) return new Response(JSON.stringify({ errors: errorsList }), { status: 400 });

  // encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = await prisma.user.create({
    data: {
      name, surname, email, phone_number, street_address, postal_code, city, country, password: hashedPassword,
    },
  });

  if (newUser) {

    // generate unique iban for checking and saving, check if it already exists
    const checkingIban = await generateUniqueIban();
    await prisma.userAccount.create({
      data: {
        user_id: newUser.id,
        iban: checkingIban,
        amount: 0,
        name: 'Checking',
      },
    });

    // generate unique iban for checking and saving, check if it already exists
    const savingsIban = await generateUniqueIban();
    await prisma.userAccount.create({
      data: {
        user_id: newUser.id,
        iban: savingsIban,
        amount: 0,
        name: 'Savings',
      },
    });

    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
  }
}

async function generateUniqueIban() {
    // generate unique iban for checking and saving, check if it already exists
    let iban = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    let userAccount = await prisma.userAccount.findUnique({ where: { iban } });
    while (userAccount) {
      iban = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      userAccount = await prisma.userAccount.findUnique({ where: { iban } });
    }
    return iban;
}