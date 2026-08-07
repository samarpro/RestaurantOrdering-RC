import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createRestaurantOrderController } from "../controllers/index.js";
import {
  buildMenuTable,
  formatReceipt,
} from "../views/cli/table-formatters.js";

const controller = createRestaurantOrderController();

describe("CLI table formatters", () => {
  it("builds menu rows dynamically from restaurant data", () => {
    const restaurant = controller.getRestaurant();
    const rows = buildMenuTable(restaurant);

    assert.equal(rows.length, restaurant.menu.products.length);
    assert.deepEqual(rows[0], {
      Category: "🍔 Burgers",
      Product: "Cheeseburger",
      Price: "$15",
    });
  });

  it("formats the receipt using the required output", () => {
    const invoice = controller.processOrder({
      items: [
        { productId: "cheeseburger", quantity: 2 },
        { productId: "large-soft-drink", quantity: 1 },
      ],
    });

    assert.equal(
      formatReceipt(invoice, "GST"),
      [
        "Cheeseburger x 2 $30",
        "Soft drink (Large) x 1 $5",
        "",
        "Total $35",
        "Including GST ($3.18)",
      ].join("\n"),
    );
  });
});
