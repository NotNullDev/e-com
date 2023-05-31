import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Category } from "@prisma/client";
import { type NextPage } from "next";
import { CategorySelector } from "../components/index/CategorySelect";
import { ProductCard } from "../components/index/ProductCard";
import { SingleProductSkeleton } from "../components/index/ProductSkeleton";
import { ProductsTitle } from "../components/index/ProductsTitle";
import { SortComponent } from "../components/index/SortComponent";
import { productsStore } from "../logic/common/productsStore";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const resetId = productsStore((state) => state.resetId);
  const filteredProducts = trpc.products.filtered.useQuery(
    productsStore.getState().filters,
    {
      onSuccess: (data) => {
        productsStore.setState((old) => {
          if (filteredProducts.data) {
            old.products = data;
          } else {
            old.products = [];
          }
        });
      },
    }
  );
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
              <SortComponent key={resetId} />
            </div>
          </div>
          <h2 className="mb-2 w-min whitespace-nowrap bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-3xl font-bold italic text-opacity-0">
            <ProductsTitle key={resetId} />
          </h2>
          <div
            className="grid grid-cols-2 gap-10 md:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5"
            ref={parent}
          >
            {filteredProducts.status === "success" && (
              <>
                {filteredProducts.data?.map((p) => (
                  <ProductCard key={p.id} product={p}/>
                ))}
              </>
            )}
            {filteredProducts.status === "loading" &&
              [...Array(20)].map((i, idx) => <SingleProductSkeleton key={idx}/>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
