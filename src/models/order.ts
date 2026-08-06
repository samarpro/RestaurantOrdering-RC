export interface OrderItemInput {
  readonly productId: string;
  readonly quantity: number;
}

export interface PlaceOrderInput {
  readonly items: readonly OrderItemInput[];
}
