import type { Item } from "./item.ts";

export interface InvoiceLine {
  readonly item: Item;
  readonly quantity: number;
  readonly subtotalCents: number;
}

export interface Invoice {
  readonly lines: readonly InvoiceLine[];
  readonly totalCents: number;
  readonly includedGstCents: number;
}
