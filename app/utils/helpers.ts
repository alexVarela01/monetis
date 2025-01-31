function formatBalance(balance: number): string {
  return balance.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export { formatBalance };