function formatBalance(balance: number): string {
  return balance.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

export { formatBalance, formatIban, formatDate };