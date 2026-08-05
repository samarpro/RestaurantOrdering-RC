export function multiplyCents(unitPriceCents: number, quantity: number): number {
  assertCents(unitPriceCents);

  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new RangeError("Quantity must be a non-negative integer");
  }

  return unitPriceCents * quantity;
}

export function sumCents(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => {
    assertCents(amount);
    return total + amount;
  }, 0);
}

export function formatAud(amountCents: number): string {
  assertCents(amountCents);

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amountCents / 100);
}

function assertCents(amountCents: number): void {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
    throw new RangeError("Money must be a non-negative integer number of cents");
  }
}
