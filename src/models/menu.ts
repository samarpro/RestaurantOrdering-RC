import type { Product } from "./product.js";

export interface Menu {
  readonly id: string; // handy when introduced multiple menus in the future
  readonly name: string;
  readonly products: readonly Product[];
}
