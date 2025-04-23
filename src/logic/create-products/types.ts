import {Category, Product} from "../../../common/db/schema";

export type ProductModel = {
  title: string;
  description: string;
  shippingTime: number;
  price: number;
  stock: number;
  files: File[];
  categories: Category[];
  previewImageIdentificator: {
    name: string;
    size: number;
  };
};

export type CategorySelectorProps = {
  category: string;
};
export type UpdatePruoductPageStoreType = {
  title: string;
  description: string;
  shippingTime: number;
  price: number;
  stock: number;
  filesUrl: string[];
  categories: Category[];
  previewImageIdentificator: {
    name: string;
    size: number;
  };
};

export type CreateProductPageStoreType = {
  product: Product;
  previewImageIdentificator: {
    name: string;
    size: number;
  };
  files: {
    url: string;
    file: File;
  }[];
  isUpdating: boolean;
  createProduct: () => Promise<boolean>;
  resetStore: () => void;
};

export type SavedFilesMapping = {
  originalFileName: string;
  newFileName: string;
};
