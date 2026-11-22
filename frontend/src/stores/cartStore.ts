import { create } from "zustand";
import { addToCart as apiAddToCart, fetchCart, removeCartItem as apiRemove, updateCartItem as apiUpdate, type CartItem } from "../api/cart";

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  fetchMyCart: () => Promise<void>;
  addItem: (productId: number, size: string) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearLocalCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchMyCart: async () => {
    set({ isLoading: true });
    try {
      const items = await fetchCart();
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, size) => {
    try {
      const newItem = await apiAddToCart(productId, size);
      const currentItems = get().items;
      const existing = currentItems.find((i) => i.id === newItem.id);
      
      if (existing) {
        set({ items: currentItems.map((i) => i.id === newItem.id ? newItem : i) });
      } else {
        set({ items: [...currentItems, newItem] });
      }
    } catch (error) {
      console.error("Ошибка добавления в корзину", error);
    }
  },

  removeItem: async (itemId) => {
    await apiRemove(itemId);
    set({ items: get().items.filter((i) => i.id !== itemId) });
  },

  updateQuantity: async (itemId, quantity) => {
    const updated = await apiUpdate(itemId, quantity);
    set({ items: get().items.map((i) => i.id === itemId ? updated : i) });
  },

  clearLocalCart: () => set({ items: [] }),
}));