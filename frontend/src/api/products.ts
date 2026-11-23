import { api } from "./client";
import type { Product } from "../types/product";

export type ProductFilters = {
  search?: string;
  brand?: string;
  max_price?: number;
};

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products", {
    params: filters,
  });
  return data;
}