export function calculateIncludedGst(totalCents: number): number {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new RangeError("Total must be a non-negative integer number of cents");
  }

  return Math.round(totalCents / 11);
}
