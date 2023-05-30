import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import type { Sorting } from "../../logic/common/productsStore";
import { ProductAtoms } from "../../logic/common/productsStore";
import { trpc } from "../../utils/trpc";
import { Rating } from "./RatingComponent";

export const SortComponent = () => {
  const [sort, setSort] = useState<Sorting>({
    price: undefined,
  });
  const trpcContext = trpc.useContext();
  const ascRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const [, setSorting] = useAtom(ProductAtoms.query.productSortingAtom);
  const [, setFilters] = useAtom(ProductAtoms.query.productFiltersAtom);
  const [, resetStore] = useAtom(ProductAtoms.mutation.resetStoreAtom);

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
    <div className="flex items-center gap-3 rounded-xl">
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
          setFilters((old) => {
            old.rating = a;
            return old;
          });
        }}
      />
      <button
        className=" btn-primary btn-sm btn ml-6 shadow shadow-gray-900"
        onClick={() => {
          trpcContext.products.filtered.invalidate();
        }}
      >
        apply filters
      </button>
      <button
        className="btn-ghost btn-sm btn shadow shadow-gray-900"
        onClick={() => {
          resetStore();
          trpcContext.products.filtered.invalidate();
        }}
      >
        clear filters
      </button>
    </div>
  );
};
