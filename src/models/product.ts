export type ProductCategory = string;

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly unitPriceCents: number;
}
