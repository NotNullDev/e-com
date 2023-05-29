import clsx from "clsx";
import { useRef } from "react";
import { getAllCategoriesAsString } from "../../utils/enumParser";
import { CategorySelector } from "./CategorySelector";

export const ProductCategories = () => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className=" flex flex-col items-start gap-3 p-4">
        <div className={clsx("flex gap-4", {})}>
          {getAllCategoriesAsString().map((c) => (
            <CategorySelector key={c} category={c} />
          ))}
        </div>
      </div>
    </>
  );
};
