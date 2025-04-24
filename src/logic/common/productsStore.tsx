import toast from "react-hot-toast";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Category, Product } from "../../../common/db/schema";

export type ProductsFilters = {
  categoriesIn: Category[];
  limit: number;
  priceSort: string | null;
  rating: number; // 1-5 , 0 = no rating
  productIds: string[];
  searchFilter: string; // old store
  singleCategoryFilter?: Category; // used for filtering on the top of the page
  setSingleCategoryFilter?: (filter: string) => void; // used for filtering on the top of the page
};
export type Sorting = {
  price: "asc" | "desc" | undefined;
};
export type ProductsStoreType = {
  filters: ProductsFilters;
  setFilters: (filters: ProductsFilters) => void;
  removeCategory: (category: Category) => void;
  addCategory: (category: Category) => void;
  addBasicFilters: () => void;
  sorting: Sorting;
  setSorting: (sorting: Sorting) => void;
  products: Product[];
  resetId: number;
  // old store
  setSelectedCategory: (newCategory: Category | null) => void;
  categoryDropdownOpen: boolean;
  resetStore: () => void;
};

export const getEmptyFilters = (): ProductsFilters => ({
  categoriesIn: [],
  limit: 30,
  priceSort: null,
  rating: 0,
  productIds: [],
  searchFilter: "",
  singleCategoryFilter: undefined,
});

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

    const addBasicFilters = () => {
      toast.error("TODO");
    };

    const setSorting = (sorting: Sorting) => {
      setState((old) => ({ ...old, sorting }));
      setFilters({
        ...getState().filters,
        priceSort: (sorting.price as string) ?? null,
      });
    };

    const resetStore = () => {
      setState((old) => {
        old.filters = getEmptyFilters();
        old.products = [];
        old.sorting = { price: undefined };
        old.resetId = old.resetId + 1;
        return old;
      });
    };

    const setSelectedCategory = (newCategory: Category | null) => {
      setState((old) => ({ ...old, selectedCategory: newCategory }));
      productsStore.getState().addBasicFilters();
    };

    return {
      filters: getEmptyFilters(),
      setFilters,
      addCategory,
      removeCategory,
      addBasicFilters,
      sorting: { price: undefined },
      setSorting,
      products: [],
      resetStore,
      resetId: 0,
      categoryDropdownOpen: false,
      setSelectedCategory,
    };
  })
);
