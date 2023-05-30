import type { Category } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { ProductAtoms } from "../../logic/common/productsStore";

type CategorySelectorProps = {
  category: string;
};

export const CategorySelector = ({ category: c }: CategorySelectorProps) => {
  const [enabled, setEnabled] = useState(false);
  const [, addCategory] = useAtom(ProductAtoms.mutation.addCategoryAtom);
  const [, removeCategory] = useAtom(ProductAtoms.mutation.deleteCategoryAtom);

  const [selectedCategories] = useAtom(
    ProductAtoms.query.categoriesInFilterAtom
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
      addCategory({ category: c as Category });
    } else {
      removeCategory({ categoryToDelete: c as Category });
    }
  }, [enabled]);

  return (
    <div
      className={
        "cursor-pointer rounded-xl bg-base-200 p-2 px-4 transition-all duration-300 active:scale-90 " +
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
