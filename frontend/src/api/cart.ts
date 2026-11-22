import { api } from "./client";
import type { Product } from "../types/product";

export type CartItem = {
  id: number;
  product_id: number;
  size: string;
  quantity: number;
  product: Product;
};

export async function fetchCart(): Promise<CartItem[]> {
  const { data } = await api.get<CartItem[]>("/cart");
  return data;
}

export async function addToCart(product_id: number, size: string, quantity: number = 1): Promise<CartItem> {
  const { data } = await api.post<CartItem>("/cart", { product_id, size, quantity });
  return data;
}

export async function updateCartItem(item_id: number, quantity: number): Promise<CartItem> {
  const { data } = await api.put<CartItem>(`/cart/${item_id}`, { quantity });
  return data;
}

export async function removeCartItem(item_id: number): Promise<void> {
  await api.delete(`/cart/${item_id}`);
}