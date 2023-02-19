export {};
// import type { Product } from "@prisma/client";
// import create from "zustand";
// import { persist } from "zustand/middleware";
// import { immer } from "zustand/middleware/immer";
// import { productsStore } from "./productsStore";

// export type CartItem = {
//   productId: string;
//   quantity: number;
// };

// export type CartStoreType = {
//   items: CartItem[];
//   addItem: (items: CartItem) => void;
//   getQuantity: (productId: string) => number;
//   loginRequired: boolean; // used to make login jump
// };

// export const cartStore = create<CartStoreType>()(
//   persist(
//     immer((set, get, store) => {
//       const addItem = (item: CartItem) => {
//         const existingItem = get().items.find(
//           (i) => i.productId === item.productId
//         );
//         if (existingItem) {
//           set((state) => {
//             const existing = state.items.find(
//               (i) => i.productId === item.productId
//             );
//             if (existing) {
//               existing.quantity = item.quantity;
//             }
//             return state;
//           });
//           return;
//         }
//         set((state) => {
//           state.items.push(item);
//           return state;
//         });
//       };

//       const getQuantity = (productId: string) => {
//         const item = get().items.find((i) => i.productId === productId);
//         if (!item) return 0;
//         return item.quantity;
//       };

//       return {
//         items: [],
//         addItem,
//         getQuantity,
//         loginRequired: false,
//       };
//     })
//   )
// );

// export type FullCartItem = CartItem & Product;

// export const getCurrenCart = () => {
//   const items = cartStore.getState().items;
//   const allProducts = productsStore.getState().products;
//   const products = items.map((item) => {
//     const product = allProducts.find((p) => p.id === item.productId);
//     if (!product) return null;
//     return {
//       ...product,
//       quantity: item.quantity,
//     } as FullCartItem;
//   });
//   return products;
// };
