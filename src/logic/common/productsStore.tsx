import type { Category, Product } from "@prisma/client";
import { atom } from "jotai";
import { selectAtom } from "jotai/utils";

export type ProductsFilters = {
  categoriesIn: Category[];
  limit: number;
  priceSort: string | null;
  rating: number; // 1-5 , 0 = no rating
  productIds: string[];
  searchFilter: string; // old store
  singleCategoryFilter?: Category; // used for filtering on the top of the page
  setSingleCategoryFilter?: (filter: string) => void; // used for filtering on the top of the page
  skip: number;
};
export type Sorting = {
  price: "asc" | "desc" | undefined;
};
export type ProductsStoreType = {
  filters: ProductsFilters;
  sorting: Sorting;
  products: Product[];
  resetId: number;
  // old store
  categoryDropdownOpen: boolean;
  setSelectedCategory: (newCategory: Category | null) => void;
  setSorting: (sorting: Sorting) => void;
  setFilters: (filters: ProductsFilters) => void;
  removeCategory: (category: Category) => void;
  addCategory: (category: Category) => void;
  addBasicFilters: () => void;
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
  skip: 0,
});

// export const productsStore = create<ProductsStoreType>()(
//   immer((setState, getState, getStore) => {
//     const setFilters = (filters: ProductsFilters) => {
//       setState((old) => ({ ...old, filters: filters }));
//     };

//     const addCategory = (category: Category) => {
//       const exist = !!getState().filters.categoriesIn.find(
//         (c) => c === category
//       );
//       if (exist) return;

//       setState((old) => {
//         old.filters.categoriesIn = [...old.filters.categoriesIn, category];
//       });
//     };

//     const removeCategory = (category: Category) => {
//       const categories = getState().filters.categoriesIn;
//       const filtered = categories.filter((c) => c != category);

//       setState((old) => {
//         old.filters.categoriesIn = filtered;
//       });
//     };

//     const addBasicFilters = () => {
//       toast.error("TODO");
//     };

//     const setSorting = (sorting: Sorting) => {
//       setState((old) => ({ ...old, sorting }));
//       setFilters({
//         ...getState().filters,
//         priceSort: (sorting.price as string) ?? null,
//       });
//     };

//     const resetStore = () => {
//       setState((old) => {
//         old.filters = getEmptyFilters();
//         old.products = [];
//         old.sorting = { price: undefined };
//         old.resetId = old.resetId + 1;
//         return old;
//       });
//     };

//     const setSelectedCategory = (newCategory: Category | null) => {
//       setState((old) => ({ ...old, selectedCategory: newCategory }));
//       productsStore.getState().addBasicFilters();
//     };

//     return {
//       filters: getEmptyFilters(),
//       setFilters,
//       addCategory,
//       removeCategory,
//       addBasicFilters,
//       sorting: { price: undefined },
//       setSorting,
//       products: [],
//       resetStore,
//       resetId: 0,
//       categoryDropdownOpen: false,
//       setSelectedCategory,
//     };
//   })
// );

const productFiltersAtom = atom<ProductsFilters>(getEmptyFilters());
const productsAtom = atom<Product[]>([]);
const productSortingAtom = atom<Sorting>({
  price: undefined,
} as Sorting);
const singleCategoryFilterAtom = selectAtom(
  productFiltersAtom,
  (p) => p.singleCategoryFilter
);
const categoriesInFilterAtom = selectAtom(
  productFiltersAtom,
  (f) => f.categoriesIn
);
const resetIdAtom = atom<number>(0);
const selectedCategoryAtom = atom<Category | null>(null);
const addCategoryAtom = atom(
  null,
  (get, set, { category }: { category: Category }) => {
    const categories = get(productFiltersAtom);

    const exist = !!categories.categoriesIn.find((c) => c === category);
    if (exist) return;

    set(productFiltersAtom, {
      ...categories,
      categoriesIn: [...categories.categoriesIn, category],
    });
  }
);
const deleteCategoryAtom = atom(
  null,
  (get, set, { categoryToDelete }: { categoryToDelete: Category }) => {
    const cat = get(productFiltersAtom);
    set(productFiltersAtom, {
      ...cat,
      categoriesIn: cat.categoriesIn.filter((c) => c === categoryToDelete),
    });
  }
);
const resetStoreAtom = atom(null, (get, set) => {
  set(productsAtom, []);
});

export const ProductAtoms = {
  query: {
    productFiltersAtom,
    productsAtom,
    productSortingAtom,
    selectedCategoryAtom,
    singleCategoryFilterAtom,
    categoriesInFilterAtom,
  },
  mutation: {
    addCategoryAtom,
    deleteCategoryAtom,
    resetIdAtom,
    resetStoreAtom,
  },
};
