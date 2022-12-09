import type { Category } from "@prisma/client";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

export type ProductsFilters = {
  titleContains: string;
  categoriesIn: Category[];
  limit: number;
  priceSort: string | null;
  rating: number; // 1-5 , 0 = no rating
};
export type Sorting = {
  price: "asc" | "desc" | undefined;
};
export type ProductsStoreType = {
  filters: ProductsFilters;
  setFilters: (filters: ProductsFilters) => void;
  removeCategory: (category: Category) => void;
  addCategory: (category: Category) => void;
  addBasicFilters: (titleContains: string, c: Category | null) => void;
  sorting: Sorting;
  setSorting: (sorting: Sorting) => void;
};

export const productsStore = create<ProductsStoreType>()(
  immer((setState, getState, getStore) => {
    const setFilters = (filters: ProductsFilters) => {
      setState((old) => ({ ...old, filters: filters }));
    };

    const addCategory = (category: Category) => {
      const exist = !!getState().filters.categoriesIn.find(
        (c) => c === category
      );
      if (exist) return;

      setState((old) => {
        old.filters.categoriesIn = [...old.filters.categoriesIn, category];
      });
    };

    const removeCategory = (category: Category) => {
      const categories = getState().filters.categoriesIn;
      const filtered = categories.filter((c) => c != category);

      setState((old) => {
        old.filters.categoriesIn = filtered;
      });
    };

    const addBasicFilters = (titleContains: string, c: Category | null) => {
      setState((old) => ({
        ...old,
        filters: {
          ...old.filters,
          categoriesIn: c ? [c] : [],
          titleContains,
        },
      }));
    };

    const setSorting = (sorting: Sorting) => {
      setState((old) => ({ ...old, sorting }));
      setFilters({
        ...getState().filters,
        priceSort: (sorting.price as string) ?? null,
      });
    };

    return {
      filters: {
        titleContains: "",
        categoriesIn: [],
        limit: 30,
        priceSort: null,
        rating: 0,
      },
      setFilters,
      addCategory,
      removeCategory,
      addBasicFilters,
      sorting: { price: undefined },
      setSorting,
    };
  })
);
