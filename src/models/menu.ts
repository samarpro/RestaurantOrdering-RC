import type { Product, ProductCategory } from "./product.js";

export interface MenuCategory {
  readonly id: ProductCategory;
  readonly name: string;
  readonly icon: string;
}

export interface Menu {
  readonly id: string;
  readonly name: string;
  readonly categories: readonly MenuCategory[];
  readonly products: readonly Product[];
}
