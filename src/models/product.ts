export type ProductCategory = "burger" | "soft-drink";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly unitPriceCents: number;
}
