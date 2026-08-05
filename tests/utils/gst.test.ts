import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calculateIncludedGst } from "../../src/utils/gst.ts";

describe("calculateIncludedGst", () => {
  it("extracts 10% GST from a GST-inclusive total", () => {
    assert.equal(calculateIncludedGst(3_500), 318);
  });

  it("returns zero for a zero total", () => {
    assert.equal(calculateIncludedGst(0), 0);
  });

  it("rejects fractional cents", () => {
    assert.throws(() => calculateIncludedGst(10.5), RangeError);
  });
});
