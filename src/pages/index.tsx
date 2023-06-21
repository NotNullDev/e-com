import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Category } from "@prisma/client";
import { type NextPage } from "next";
import { CategorySelector } from "../components/index/CategorySelect";
import { ProductCard } from "../components/index/ProductCard";
import { SingleProductSkeleton } from "../components/index/ProductSkeleton";
import { SortComponent } from "../components/index/SortComponent";
import { productsStore } from "../logic/common/productsStore";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const resetId = productsStore((state) => state.resetId);
  const trpcUtils = trpc.useContext();
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
          <div
            className="mt-7 grid grid-cols-2 gap-20 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
              [...Array(20)].map((i, idx) => (
                <SingleProductSkeleton key={idx}/>
              ))}
          </div>
          <div className="mt-10 flex w-full items-center justify-center">
            <button
              className="btn-primary btn"
              onClick={() => {
                productsStore.setState((store) => {
                  store.filters.limit += 20;
                });
                trpcUtils.products.invalidate();
              }}
            >
              load more
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
