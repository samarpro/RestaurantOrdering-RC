import restaurantData from "../data/restaurant.json" with { type: "json" };
import type {
  Menu,
  MenuCategory,
  Product,
  Restaurant,
  TaxConfiguration,
} from "../models/index.js";

type UnknownRecord = Record<string, unknown>;

function readRecord(value: unknown, path: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return value as UnknownRecord;
}

function readString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${path} must be a non-empty string`);
  }

  return value;
}

function readNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${path} must be a finite number`);
  }

  return value;
}

function readBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(`${path} must be a boolean`);
  }

  return value;
}

function readArray(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`${path} must be an array`);
  }

  return value;
}

function parseCategory(value: unknown, index: number): MenuCategory {
  const category = readRecord(value, `menu.categories[${index}]`);

  return Object.freeze({
    id: readString(category["id"], `menu.categories[${index}].id`),
    name: readString(category["name"], `menu.categories[${index}].name`),
    icon: readString(category["icon"], `menu.categories[${index}].icon`),
  });
}

function parseProduct(value: unknown, index: number): Product {
  const product = readRecord(value, `menu.products[${index}]`);
  const unitPriceCents = readNumber(
    product["unitPriceCents"],
    `menu.products[${index}].unitPriceCents`,
  );

  if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) {
    throw new RangeError(`menu.products[${index}].unitPriceCents must be a non-negative integer`);
  }

  return Object.freeze({
    id: readString(product["id"], `menu.products[${index}].id`),
    name: readString(product["name"], `menu.products[${index}].name`),
    category: readString(product["category"], `menu.products[${index}].category`),
    unitPriceCents,
  });
}

function ensureUniqueIds(items: readonly { readonly id: string }[], path: string): void {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`${path} contains duplicate id "${item.id}"`);
    }
    ids.add(item.id);
  }
}

function parseMenu(value: unknown): Menu {
  const raiseError:boolean = false;
  const menu = readRecord(value, "menu");
  const categories = readArray(menu["categories"], "menu.categories").map(parseCategory);
  const products = readArray(menu["products"], "menu.products").map(parseProduct);

  ensureUniqueIds(categories, "menu.categories");
  ensureUniqueIds(products, "menu.products");

  const categoryIds = new Set(categories.map((category) => category.id));
  for (const product of products) {
    if (!categoryIds.has(product.category)) {
      if (raiseError) {
        throw new Error(`Product "${product.id}" references unknown category "${product.category}"`);
      }
      products.splice(products.indexOf(product), 1);
    }
  }

  return Object.freeze({
    id: readString(menu["id"], "menu.id"),
    name: readString(menu["name"], "menu.name"),
    categories: Object.freeze(categories),
    products: Object.freeze(products),
  });
}

function parseTax(value: unknown): TaxConfiguration {
  const tax = readRecord(value, "tax");
  const ratePercent = readNumber(tax["ratePercent"], "tax.ratePercent");

  if (ratePercent < 0) {
    throw new RangeError("tax.ratePercent must not be negative");
  }

  return Object.freeze({
    name: readString(tax["name"], "tax.name"),
    ratePercent,
    pricesInclusive: readBoolean(tax["pricesInclusive"], "tax.pricesInclusive"),
  });
}

function parseRestaurant(value: unknown): Restaurant {
  const restaurant = readRecord(value, "restaurant");

  return Object.freeze({
    id: readString(restaurant["id"], "restaurant.id"),
    name: readString(restaurant["name"], "restaurant.name"),
    tax: parseTax(restaurant["tax"]),
    menu: parseMenu(restaurant["menu"]),
  });
}

const restaurant = parseRestaurant(restaurantData);

/** Returns validated restaurant operation data from the JSON configuration. */
export function getRestaurant(): Restaurant {
  return restaurant;
}
