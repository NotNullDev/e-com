import type {Product} from "@prisma/client";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";

export type AccountPageStoreType = {
  products: Product[];
  selectedProductToDelete?: Product;
};

export const accountPageStore = create<AccountPageStoreType>()(
  immer((set, get, store) => {
    return {
      products: [],
    };
  })
);
