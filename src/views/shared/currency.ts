export function formatCurrency(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new RangeError("Currency value must be a non-negative integer number of cents");
  }

  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}
