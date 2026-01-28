import { serialize } from "cookie";

function formatBalance(balance?: number): string {
  if (typeof balance !== 'number' || isNaN(balance)) {
    return '0,00';
  }

  return balance.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


function formatIban(iban: string) {
  return iban.match(/.{1,4}/g)?.join(" ") || iban;
}

function formatDate(date: string) {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
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

export { formatBalance, formatIban, formatDate, setCookieProperties };