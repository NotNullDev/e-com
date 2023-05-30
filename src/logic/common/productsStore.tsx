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
