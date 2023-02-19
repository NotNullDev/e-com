import type { Category } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { productsStore } from "../../logic/common/productsStore";

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
        "transition-all duration-300 active:scale-90 cursor-pointer rounded-xl bg-base-200 p-2 px-4 " + ` ${activeStyle}`
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
