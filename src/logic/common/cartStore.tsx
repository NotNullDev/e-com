import type { Product } from "@prisma/client";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { toast } from "react-hot-toast";
import { ProductAtoms } from "./productsStore";
export type CartItem = {
  productId: string;
  quantity: number;
};
export type FullCartItem = CartItem & Product;

const cartItemsAtom = atom<CartItem[]>([]);

// makes login button to jump for a while
const loginSuggestionAtom = atom(false);

const cartAtom = atom<FullCartItem[]>((get) => {
  const items = get(cartItemsAtom);
  const allProducts = get(ProductAtoms.query.productsAtom);

  const products = items.map((item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) return null;
    return {
      ...product,
      quantity: item.quantity,
    } as FullCartItem;
  });

  return products.filter((p) => p !== null) as FullCartItem[];
});

const cartPriceSummary = atom((get) => {
  return get(cartAtom).reduce((p, c) => p + c.price, 0);
});

const getQuantityAtom = atomFamily(
  (productId: string) =>
    atom((get) => {
      return (
        get(cartItemsAtom).find((item) => item.productId === productId)
          ?.quantity ?? 0
      );
    }),
  (a, b) => a === b
);

const addItemAtom = atom(
  null,
  (
    get,
    set,
    { productId, quantity }: { productId: string; quantity: number }
  ) => {
    const productToAdd = get(ProductAtoms.query.productsAtom).find(
      (p) => p.id === productId
    );
    if (!productToAdd) {
      toast.error("product to add not found!");
      return;
    }

    set(cartItemsAtom, [...get(cartItemsAtom), { productId, quantity }]);
  }
);

const removeItemAtom = atom(
  null,
  (get, set, { productId }: { productId: string }) => {
    set(
      cartItemsAtom,
      get(cartItemsAtom).filter((p) => p.productId !== productId)
    );
  }
);

const removeItemsAtom = atom(
  null,
  (get, set, { productIds }: { productIds: string[] }) => {
    set(
      cartItemsAtom,
      get(cartItemsAtom).filter(
        (p) => !productIds.find((p1) => p1 === p.productId)
      )
    );
  }
);

const clearCartAtom = atom(null, (get, set) => {
  set(cartItemsAtom, []);
});

export const CartAtoms = {
  query: {
    cartItemsAtom,
    loginSuggestionAtom,
    cartAtom,
    getQuantityAtom,
    cartPriceSummary,
  },
  mutation: {
    addItemAtom,
    removeItemAtom,
    clearCartAtom,
  },
};
