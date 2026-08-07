import type { Invoice, Restaurant } from "../../models/index.js";
import { formatCurrency } from "../shared/currency.js";

export interface MenuTableRow {
  readonly Category: string;
  readonly Product: string;
  readonly Price: string;
}

export interface ReceiptTableRow {
  readonly Product: string;
  readonly Quantity: number;
  readonly "Unit price": string;
  readonly Subtotal: string;
}

export function buildMenuTable(restaurant: Restaurant): MenuTableRow[] {
  const categoriesById = new Map(
    restaurant.menu.categories.map((category) => [category.id, category]),
  );

  return restaurant.menu.products.map((product) => {
    const category = categoriesById.get(product.category);

    return {
      Category: category === undefined ? product.category : `${category.icon} ${category.name}`,
      Product: product.name,
      Price: formatCurrency(product.unitPriceCents),
    };
  });
}

export function buildReceiptTable(invoice: Invoice): ReceiptTableRow[] {
  return invoice.lines.map((line) => ({
    Product: line.description,
    Quantity: line.quantity,
    "Unit price": formatCurrency(line.unitPriceCents),
    Subtotal: formatCurrency(line.subtotalCents),
  }));
}
