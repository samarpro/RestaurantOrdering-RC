import type { Product } from "./product.js";

export interface Menu {
  readonly id: string;
  readonly name: string;
  readonly products: readonly Product[];
}
