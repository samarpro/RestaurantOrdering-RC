import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatCurrency } from "../views/shared/currency.js";

describe("formatCurrency", () => {
  it("formats whole and fractional dollar amounts", () => {
    assert.equal(formatCurrency(1_500), "$15");
    assert.equal(formatCurrency(318), "$3.18");
    assert.equal(formatCurrency(0), "$0");
  });

  it("rejects invalid cent values", () => {
    for (const cents of [-1, 1.5]) {
      assert.throws(() => formatCurrency(cents), /non-negative integer/);
    }
  });
});
