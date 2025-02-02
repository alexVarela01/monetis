import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function generateUniqueIban() {
  function generateRandomIban() {
    return "PT50" + Array.from({ length: 21 }, () => Math.floor(Math.random() * 10)).join('');
  }

  let iban = generateRandomIban();
  let userAccount = await prisma.userAccount.findUnique({ where: { iban } });

  while (userAccount) {
    iban = generateRandomIban();
    userAccount = await prisma.userAccount.findUnique({ where: { iban } });
  }

  return iban;
}

export { generateUniqueIban };