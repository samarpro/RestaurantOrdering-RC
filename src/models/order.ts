export interface OrderItem {
  readonly productId: string;
  readonly quantity: number;
}

export interface Order {
  readonly items: readonly OrderItem[];
}
