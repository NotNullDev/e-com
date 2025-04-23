import {Category} from "../../common/db/schema";

export class Converters {
  static stringToCategory(category: string): Category {
    return category.replaceAll(" ", "_") as Category;
  }

  static categoryToString(category?: Category): string {
    return category?.replaceAll("_", " ") ?? "";
  }
}
