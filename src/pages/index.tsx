import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { DealType, Product } from "@prisma/client";
import { Category } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

import { trpc } from "../utils/trpc";

type ProductsFilters = {
  titleContains: string;
  categoriesIn: Category[];
  limit: number;
  priceSort: string | null;
  rating: number; // 1-5 , 0 = no rating
};

type Sorting = {
  price: "asc" | "desc" | undefined;
};

type ProductsStoreType = {
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

const Home: NextPage = () => {
  const filters = productsStore((state) => state.filters);
  const filteredProducts = trpc.products.filtered.useQuery(filters);
  const titleContains = productsStore((state) => state.filters.titleContains);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const allCategories = [
    ...Object.keys(Category).filter((c) => isNaN(Number(c))),
  ];

  return (
    <>
      <div className="mb-10 flex h-full w-full">
        <div className="flex flex-[8] flex-col rounded-xl p-6">
          <div className="mb-5 flex gap-1">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {allCategories.map((c) => (
                  <CategorySelector category={c} key={c} />
                ))}
              </div>
              <div className="ml-3 h-[2px] w-10 bg-indigo-500"></div>
              <SortComponent />
            </div>
          </div>
          <h2 className="mb-2 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            {titleContains &&
              titleContains.trim().length !== 0 &&
              'Products contains "' + filters.titleContains + '"'}
            {(!filters.titleContains ||
              filters.titleContains.trim().length === 0) &&
              "All products"}
          </h2>
          <div className="grid grid-cols-5 gap-10" ref={parent}>
            {filteredProducts.status === "success" && (
              <>
                {filteredProducts.data?.map((p) => (
                  <SingleProductPreview key={p.id} product={p} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type CategorySelectorProps = {
  category: string;
};
const CategorySelector = ({ category: c }: CategorySelectorProps) => {
  const [enabled, setEnabled] = useState(false);
  const addCategory = productsStore((state) => state.addCategory);
  const removeCategory = productsStore((state) => state.removeCategory);

  const selectedCategories = productsStore(
    (state) => state.filters.categoriesIn
  );

  const enabledStyle = "bg-primary text-primary-content";

  const activeStyle = useMemo(() => (enabled ? enabledStyle : ""), [enabled]);

  useEffect(() => {
    if (selectedCategories.includes(c as Category)) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (enabled) {
      addCategory(c as Category);
    } else {
      removeCategory(c as Category);
    }
  }, [enabled]);

  return (
    <div
      className={
        "cursor-pointer rounded-xl bg-base-200 p-2 px-4 " + ` ${activeStyle}`
      }
      key={c}
      onClick={() => {
        setEnabled((old) => !old);
      }}
    >
      {c.replaceAll("_", " ")}
    </div>
  );
};

type SingleProductPreviewProps = {
  product: Product;
};
const SingleProductPreview = ({ product }: SingleProductPreviewProps) => {
  return (
    <>
      <Link
        href={"/details/" + product.id ?? 0}
        className="card card-compact relative h-[300px] w-[250px] cursor-pointer bg-base-100 text-base shadow-xl hover:opacity-80"
      >
        <figure>
          <Image
            src={product.previewImageUrl}
            alt="Shoes"
            width={300}
            height={150}
          />
        </figure>
        <div className="card-body flex w-full flex-col justify-between">
          <h2 className="text font-bold">{product.title}</h2>
          <div className="relative">
            <Rating rating={product.rating} key={product.id} />
          </div>
          <div className="w-full text-xl">
            {product.price} <span className="text-sm">zł</span>
          </div>
        </div>
        <SingleProductSticker dealType={product.dealType} />
      </Link>
    </>
  );
};

type SingleProductStickerProps = {
  dealType: DealType;
};
const SingleProductSticker = ({ dealType }: SingleProductStickerProps) => {
  return (
    <div className="absolute right-0 bottom-0 m-6 rotate-12">
      {dealType === "HOT" && (
        <span className=" bg-clip-text text-red-600  shadow-xl shadow-orange-600">
          HOT
        </span>
      )}
      {dealType === "HIT" && (
        <span className=" bg-clip-text text-green-500  shadow-xl shadow-yellow-500">
          HIT
        </span>
      )}
    </div>
  );
};

type RatingType = {
  rating: number;
  onClick?: (rating: number) => void;
  editable?: boolean;
};

export const Rating = ({ rating, editable, onClick: callback }: RatingType) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const uuid = useId();
  return (
    <div className="relative" key={currentRating}>
      <div
        className="z-100 rating"
        key={uuid}
        onClick={(e) => e.preventDefault()}
      >
        <input
          name={"rating" + uuid}
          className="hidden"
          checked={currentRating === 0}
        />
        {[...Array(5)].map((_, idx) => {
          return (
            <input
              key={idx}
              type="radio"
              name={"rating" + uuid}
              className={
                "mask mask-star-2 " +
                `${currentRating === 0 ? "" : "bg-orange-400"}`
              }
              checked={idx === currentRating - 1}
              onClick={() => {
                if (editable && callback) {
                  if (idx === currentRating - 1) {
                    setCurrentRating(0);
                    callback(0);
                    return;
                  }
                  setCurrentRating(idx + 1);
                  callback(idx + 1);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const SortComponent = () => {
  const [sort, setSort] = useState<Sorting>({
    price: undefined,
  });
  const ascRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const setSorting = productsStore((state) => state.setSorting);

  const handlePriceSortingChange = (s: "asc" | "desc") => {
    if (s === "asc") {
      if (sort.price === "asc") {
        setSort((old) => ({ ...old, price: undefined }));
        ascRef.current?.classList.remove("bg-slate-700");
        descRef.current?.classList.remove("bg-slate-700");
      } else {
        setSort((old) => ({ ...old, price: "asc" }));
        ascRef.current?.classList.add("bg-slate-700");
        descRef.current?.classList.remove("bg-slate-700");
      }
    }

    if (s === "desc") {
      if (sort.price === "desc") {
        setSort((old) => ({ ...old, price: undefined }));
        ascRef.current?.classList.remove("bg-slate-700");
        descRef.current?.classList.remove("bg-slate-700");
      } else {
        setSort((old) => ({ ...old, price: "desc" }));
        descRef.current?.classList.add("bg-slate-700");
        ascRef.current?.classList.remove("bg-slate-700");
      }
    }
  };

  useEffect(() => {
    setSorting({ ...sort });
  }, [sort]);

  return (
    <div className="flex gap-3 rounded-xl">
      <div
        ref={ascRef}
        className="cursor-pointer  rounded-xl p-1 px-5"
        onClick={() => handlePriceSortingChange("asc")}
      >
        Cheapest
      </div>
      <div
        ref={descRef}
        className="cursor-pointer rounded-xl p-1 px-5"
        onClick={() => handlePriceSortingChange("desc")}
      >
        Most expensive
      </div>
      <Rating
        rating={0}
        editable
        onClick={(a) => {
          productsStore.setState((old) => {
            old.filters.rating = a;
          });
        }}
      />
    </div>
  );
};

export default Home;
