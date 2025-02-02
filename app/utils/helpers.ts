function formatBalance(balance: number): string {
  return balance.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatIban(iban: string) {
  return iban.slice(0, 4) + ' ' + iban.slice(4, 8) + ' ' + iban.slice(8, 12) + ' ' + iban.slice(12, 16) + ' ' + iban.slice(16, 20) + ' ' + iban.slice(20, 24) + ' ' + iban.slice(24, 25);
}

function formatDate(date: string) {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}.${month}.${year}`;
}

export { formatBalance, formatIban, formatDate };