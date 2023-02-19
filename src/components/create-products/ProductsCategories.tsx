import { getAllCategoriesAsString } from "../../utils/enumParser";
import { CategorySelector } from "./CategorySelector";

export const ProductCategories = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-3 p-4">
        <div className="w-[100px] whitespace-nowrap">Categories</div>
        <div className="ml-4 flex gap-3">
          {getAllCategoriesAsString().map((c) => (
            <CategorySelector key={c} category={c} />
          ))}
        </div>
      </div>
    </>
  );
};
