import { Category } from "@prisma/client";

export function getAllCategoriesAsString() {
  const allCategories = [
    ...Object.keys(Category).filter((c) => isNaN(Number(c))),
  ];

  return allCategories.map((c) => c.replaceAll("_", " "));
}
