import type { Invoice, Restaurant } from "../../models/index.js";
import { formatCurrency } from "../shared/currency.js";

export interface MenuTableRow {
  readonly Category: string;
  readonly Product: string;
  readonly Price: string;
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

export function formatReceipt(invoice: Invoice, taxName: string): string {
  const lines = invoice.lines.map(
    (line) => `${line.description} x ${line.quantity} ${formatCurrency(line.subtotalCents)}`,
  );

  return [
    ...lines,
    "",
    `Total ${formatCurrency(invoice.totalCents)}`,
    `Including ${taxName} (${formatCurrency(invoice.includedGstCents)})`,
  ].join("\n");
}
