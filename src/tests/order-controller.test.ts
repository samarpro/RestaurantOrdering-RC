import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { RestaurantOrderController } from "../controllers/index.js";
import type { Menu } from "../models/index.js";

const menu = JSON.parse(
  readFileSync(new URL("../data/menu.json", import.meta.url), "utf8"),
) as Menu;

describe("RestaurantOrderController", () => {
  const controller = new RestaurantOrderController(menu);

  it("exposes the restaurant menu", () => {
    assert.deepEqual(controller.getMenu(), menu);
  });

  it("processes an order through the service boundary", () => {
    const invoice = controller.processOrder({
      items: [
        { productId: "cheeseburger", quantity: 2 },
        { productId: "large-soft-drink", quantity: 1 },
      ],
    });

    assert.equal(invoice.totalCents, 3_500);
    assert.equal(invoice.includedGstCents, 318);
  });
});
