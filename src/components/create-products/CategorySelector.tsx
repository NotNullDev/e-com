import { useEffect, useMemo, useState } from "react";
import { Category } from "../../../common/db/schema";
import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";
import type { CategorySelectorProps } from "../../logic/create-products/types";

export const CategorySelector = ({ category: c }: CategorySelectorProps) => {
  const [enabled, setEnabled] = useState(false);
  const selectedCategories = createProductPageStore(
    (state) => state.product.categories
  );

  const addCategory = (category: Category) => {
    createProductPageStore.setState((old) => {
      old.product.categories = [
        ...new Set([...old.product.categories, category]),
      ];
    });
  };

  const removeCategory = (category: Category) => {
    createProductPageStore.setState((state) => {
      state.product.categories = state.product.categories.filter(
        (c) => c !== category
      );
    });
  };

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
