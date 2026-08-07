import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createRestaurantOrderController } from "../controllers/index.js";
import {
  buildMenuTable,
  buildReceiptTable,
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

  it("builds itemised receipt rows", () => {
    const invoice = controller.processOrder({
      items: [
        { productId: "cheeseburger", quantity: 2 },
        { productId: "large-soft-drink", quantity: 1 },
      ],
    });

    assert.deepEqual(buildReceiptTable(invoice), [
      {
        Product: "Cheeseburger",
        Quantity: 2,
        "Unit price": "$15",
        Subtotal: "$30",
      },
      {
        Product: "Soft drink (Large)",
        Quantity: 1,
        "Unit price": "$5",
        Subtotal: "$5",
      },
    ]);
  });
});
