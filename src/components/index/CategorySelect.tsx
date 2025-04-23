import { useEffect, useMemo, useState } from "react";
import { productsStore } from "../../logic/common/productsStore";
import {Category} from "../../../common/db/schema";

type CategorySelectorProps = {
  category: string;
};

export const CategorySelector = ({ category: c }: CategorySelectorProps) => {
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
        "cursor-pointer rounded-xl  p-2 px-4 transition-all duration-300 active:scale-90 " +
        ` ${activeStyle}`
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
