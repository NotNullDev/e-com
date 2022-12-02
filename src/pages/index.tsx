import type { DealType, Product } from "@prisma/client";
import { Category } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import toast from "react-hot-toast";
import create from "zustand";

import { trpc } from "../utils/trpc";

type ProductsFilters = {
  titleContains: string;
  categoriesIn: Category[];
  limit: number;
};

type ProductsStoreType = {
  filters: ProductsFilters;
  setFilters: (filters: ProductsFilters) => void;
  removeCategory: (category: Category) => void;
  addCategory: (category: Category) => void;
};

const productsStore = create<ProductsStoreType>()(
  (setState, getState, getStore) => {
    const setFilters = (filters: ProductsFilters) => {
      setState((old) => ({ ...old, filters: filters }));
    };

    const addCategory = (category: Category) => {
      const exist = !!getState().filters.categoriesIn.find(
        (c) => c === category
      );
      if (exist) return;

      const categories = getState().filters.categoriesIn;

      categories.push(category);

      setState((old) => ({
        ...old,
        filters: {
          ...old.filters,
          categoriesIn: categories,
        },
      }));
    };

    const removeCategory = (category: Category) => {
      const categories = getState().filters.categoriesIn;
      const filtered = categories.filter((c) => c != category);
      setState((old) => ({
        ...old,
        filters: {
          ...old.filters,
          categoriesIn: filtered,
        },
      }));
    };

    return {
      filters: { titleContains: "a", categoriesIn: [], limit: 30 },
      setFilters,
      addCategory,
      removeCategory,
    };
  }
);

const Home: NextPage = () => {
  const products = trpc.products.getHottest.useQuery({ limit: 5 });
  const hits = trpc.products.getHits.useQuery({ limit: 5 });
  const filters = productsStore((state) => state.filters);
  const filteredProducts = trpc.products.filtered.useQuery(filters);

  useEffect(() => {
    toast(filteredProducts.status);
    if (filteredProducts.status === "success") {
      toast(filteredProducts.data.length.toString());
    }
  }, [filteredProducts]);

  const allCategories = [
    ...Object.keys(Category).filter((c) => isNaN(Number(c))),
  ];

  return (
    <>
      <div className="mb-10 flex h-full w-full">
        <div className="flex flex-[8] flex-col rounded-xl p-6">
          <div className="mb-5 flex gap-1">
            {allCategories.map((c) => (
              <CategorySelector category={c} key={c} />
            ))}
          </div>
          <h2 className="mb-2 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Hot deals
          </h2>
          <div className="flex flex-wrap justify-between">
            {products.status === "success" && (
              <>
                {products.data?.map((p) => (
                  <SingleProductPreview key={p.id} product={p} />
                ))}
              </>
            )}
          </div>
          <h2 className="mb-2 mt-6 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            Trending
          </h2>
          <div className="flex flex-wrap justify-between">
            {hits.status === "success" && (
              <>
                {hits.data?.map((p) => (
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

  const enabledStyle = "bg-primary text-primary-content";

  const activeStyle = useMemo(() => (enabled ? enabledStyle : ""), [enabled]);

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
          <Rating rating={4} key={product.id} />
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
};

export const Rating = ({ rating }: RatingType) => {
  const uuid = useId();
  return (
    <div className="relative">
      <div
        className="z-100 rating"
        key={uuid}
        onClick={(e) => e.preventDefault()}
      >
        <input
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
          checked
        />
        <input
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
        />
      </div>
    </div>
  );
};

export default Home;
