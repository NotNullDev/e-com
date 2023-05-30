import { Category } from "@prisma/client";
import { type NextPage } from "next";
import { CategorySelector } from "../components/index/CategorySelect";
import { ProductCard } from "../components/index/ProductCard";
import { SingleProductSkeleton } from "../components/index/ProductSkeleton";
import { ProductsTitle } from "../components/index/ProductsTitle";
import { SortComponent } from "../components/index/SortComponent";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { ProductAtoms } from "../logic/common/productsStore";
import { trpc } from "../utils/trpc";

let observer: IntersectionObserver;
if (typeof window !== "undefined") {
  observer = new IntersectionObserver((nodes, observer) => {
    nodes.forEach((n) => {
      if (n.isIntersecting) {
        const pList = document.querySelector("#products-list") as HTMLElement;
        if (!pList) return;

        const columns =
          getComputedStyle(pList).gridTemplateColumns.split("px").length - 1;

        console.log("columns: ", columns);
        const secondRowChildIdx = pList.children.length - 2 * columns;

        return;
      }
    });
    return () => {
      observer.disconnect();
    };
  });
}

const Home: NextPage = () => {
  const [resetId] = useAtom(ProductAtoms.mutation.resetIdAtom);
  const [filters, setFilters] = useAtom(ProductAtoms.query.productFiltersAtom);
  const [products, setProducts] = useAtom(ProductAtoms.query.productsAtom);
  const { isSuccess, isLoading } = trpc.products.filtered.useQuery(filters, {
    onSuccess: (data) => {
      setProducts(data);
    },
  });

  const allCategories = [
    ...Object.keys(Category).filter((c) => isNaN(Number(c))),
  ];

  useEffect(() => {
    const list = document.querySelector("#products-list");

    if (!list || !isSuccess) {
      observer.disconnect();
      return;
    }

    const columns =
      getComputedStyle(list).gridTemplateColumns.split("px").length - 1;

    console.log("columns: ", columns);
    const secondRowChildIdx = list.children.length - 2 * columns;
    const secondRowChild = list.children[secondRowChildIdx];

    if (!list || !isSuccess || !secondRowChild) {
      observer.disconnect();
    } else {
      observer.observe(secondRowChild as Element);
    }

    return () => {
      observer.disconnect();
    };
  }, [filters, isSuccess]);

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
            id="products-list"
          >
            {isSuccess && (
              <>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </>
            )}
            {isLoading &&
              [...Array(20)].map((i, idx) => (
                <SingleProductSkeleton key={idx} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
