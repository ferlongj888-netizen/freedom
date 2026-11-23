import { api } from "./client";

export type OrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  size: string;
  quantity: number;
  price_at_moment: string;
};

export type Order = {
  id: number;
  status: string;
  total_price: string;
  created_at: string;
  items: OrderItem[];
};

export async function createOrder(): Promise<Order> {
  const { data } = await api.post<Order>("/orders");
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}