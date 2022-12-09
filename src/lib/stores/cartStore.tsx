import create from "zustand";
import { immer } from "zustand/middleware/immer";

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
