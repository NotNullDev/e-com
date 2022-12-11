import type { Product } from "@prisma/client";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { productsStore } from "./productsStore";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartStoreType = {
  items: CartItem[];
  addItem: (items: CartItem) => void;
};

export const cartStore = create<CartStoreType>()(
  immer((set, get, store) => {
    const addItem = (item: CartItem) => {
      set((state) => {
        state.items.push(item);
        return state;
      });
    };

    return {
      items: [],
      addItem,
    };
  })
);

export type FullCartItem = CartItem & Product;

export const getCurrenCart = () => {
  const items = cartStore.getState().items;
  const allProducts = productsStore.getState().products;
  const products = items.map((item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) return null;
    return {
      ...product,
      quantity: item.quantity,
    } as FullCartItem;
  });
  return products;
};
