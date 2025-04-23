import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {Product} from "../../../common/db/schema";

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
