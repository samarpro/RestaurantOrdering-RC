import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatAud, multiplyCents, sumCents } from "../../src/utils/money.ts";

describe("money helpers", () => {
  it("multiplies an integer price by a quantity", () => {
    assert.equal(multiplyCents(1_500, 2), 3_000);
  });

  it("sums monetary amounts", () => {
    assert.equal(sumCents([3_000, 500]), 3_500);
  });

  it("formats cents as Australian dollars", () => {
    assert.equal(formatAud(3_500), "$35.00");
  });

  it("rejects fractional quantities", () => {
    assert.throws(() => multiplyCents(1_500, 1.5), RangeError);
  });
});
