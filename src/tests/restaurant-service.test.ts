import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getRestaurant } from "../services/index.js";

describe("getRestaurant", () => {
  it("converts restaurant JSON into validated operation data", () => {
    const restaurant = getRestaurant();

    assert.equal(restaurant.name, "Counter");
    assert.deepEqual(restaurant.tax, {
      name: "GST",
      ratePercent: 10,
      pricesInclusive: true,
    });
    assert.deepEqual(
      restaurant.menu.categories.map(({ id }) => id),
      ["burger", "soft-drink", "fries"],
    );
    assert.ok(restaurant.menu.products.length > 0);
    assert.ok(Object.isFrozen(restaurant));
  });
});
