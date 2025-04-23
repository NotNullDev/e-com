import {category} from "../../common/db/schema";

export function getAllCategoriesAsString() {
  const allCategories = category.enumValues;

  return allCategories.map((c) => c.replaceAll("_", " "));
}
