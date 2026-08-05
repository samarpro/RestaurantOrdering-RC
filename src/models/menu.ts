import type { Product } from "./product.ts";

export interface Menu {
  readonly id: string;
  readonly name: string;
  readonly products: readonly Product[];
}
