import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Menu } from "../models/index.js";
import { processOrder } from "../services/index.js";

const menu: Menu = {
  id: "main",
  name: "Main menu",
  products: [
    {
      id: "cheeseburger",
      name: "Cheeseburger",
      category: "burger",
      unitPriceCents: 1500,
    },
    {
      id: "chicken-burger",
      name: "Chicken burger",
      category: "burger",
      unitPriceCents: 2000,
    },
    {
      id: "large-soft-drink",
      name: "Soft drink (Large)",
      category: "soft-drink",
      unitPriceCents: 500,
    },
  ],
};

describe("processOrder", () => {
  it("groups repeated products and calculates an invoice", () => {
    const invoice = processOrder(
      {
        items: [
          { productId: "cheeseburger", quantity: 1 },
          { productId: "large-soft-drink", quantity: 1 },
          { productId: "cheeseburger", quantity: 1 },
        ],
      },
      menu,
    );

    assert.deepEqual(invoice, {
      lines: [
        {
          productId: "cheeseburger",
          description: "Cheeseburger",
          unitPriceCents: 1500,
          quantity: 2,
          subtotalCents: 3000,
        },
        {
          productId: "large-soft-drink",
          description: "Soft drink (Large)",
          unitPriceCents: 500,
          quantity: 1,
          subtotalCents: 500,
        },
      ],
      totalCents: 3_500,
      includedGstCents: 318,
    });
  });

  it("returns a zero-value invoice for an empty order", () => {
    assert.deepEqual(processOrder({ items: [] }, menu), {
      lines: [],
      totalCents: 0,
      includedGstCents: 0,
    });
  });

  it("rejects products that are not on the menu", () => {
    assert.throws(
      () => processOrder({ items: [{ productId: "unknown", quantity: 1 }] }, menu),
      /not on the menu/,
    );
  });

  it("rejects non-positive or fractional quantities", () => {
    for (const quantity of [0, -1, 1.5]) {
      assert.throws(
        () => processOrder({ items: [{ productId: "cheeseburger", quantity }] }, menu),
        /positive integer/,
      );
    }
  });
});
