import { PrismaClient } from "@prisma/client";
import { ibanCodes } from "@/app/api/ibanCodes";

const prisma = new PrismaClient();

// Define the type of keys in ibanCodes
type CountryCode = keyof typeof ibanCodes;

async function generateUniqueIban(countryCode: CountryCode = "PT") {
  let countryData = ibanCodes[countryCode];

  if (!countryData) {
    countryData = ibanCodes["PT"];
  }

  const { code, length } = countryData;

  function generateRandomIban() {
    const randomDigits = Array.from(
      { length: length - countryCode.length - code.toString().length },
      () => Math.floor(Math.random() * 10)
    ).join("");

    return `${countryCode}${code}${randomDigits}`;
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
