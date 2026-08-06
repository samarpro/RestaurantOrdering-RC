import type {
  Invoice,
  InvoiceLine,
  Menu,
  OrderItemInput,
  PlaceOrderInput,
  Product,
} from "../models/index.js";

/**
 * Combines repeated products and calculates each line subtotal.
 */
export function calculateInvoiceLines(
  items: readonly OrderItemInput[],
  products: readonly Product[],
): InvoiceLine[] {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const quantitiesByProductId = new Map<string, number>();

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new RangeError(`Quantity for product "${item.productId}" must be a positive integer`);
    }

    if (!productsById.has(item.productId)) {
      throw new Error(`Product "${item.productId}" is not on the menu`);
    }

    const currentQuantity = quantitiesByProductId.get(item.productId) ?? 0;
    quantitiesByProductId.set(item.productId, currentQuantity + item.quantity);
  }

  return Array.from(quantitiesByProductId, ([productId, quantity]) => {
    const product = productsById.get(productId);

    // Every product ID was checked above, so this branch is unreachable.
    if (product === undefined) {
      throw new Error(`Product "${productId}" is not on the menu`);
    }

    return {
      productId,
      description: product.name,
      unitPriceCents: product.unitPriceCents,
      quantity,
      subtotalCents: product.unitPriceCents * quantity,
    };
  });
}

export function calculateTotalCents(lines: readonly InvoiceLine[]): number {
  return lines.reduce((total, line) => total + line.subtotalCents, 0);
}

/**
 * Extracts the GST component from a GST-inclusive total using total / 11.
 */
export function calculateIncludedGstCents(totalCents: number): number {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new RangeError("Total must be a non-negative integer number of cents");
  }

  return Math.round(totalCents / 11);
}

/**
 * Processes an order against the supplied menu and returns its invoice.
 */
export function processOrder(input: PlaceOrderInput, menu: Menu): Invoice {
  const lines = calculateInvoiceLines(input.items, menu.products);
  const totalCents = calculateTotalCents(lines);

  return {
    lines,
    totalCents,
    includedGstCents: calculateIncludedGstCents(totalCents),
  };
}
