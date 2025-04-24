import toast from "react-hot-toast";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DealType } from "../../../common/db/schema";
import type { CreateProductPageStoreType, SavedFilesMapping } from "./types";

export type DeletePopupStoreType = {
  popupOpen: boolean;
  picturesToDeleteIds: string[];
};

export const deletePopupStore = create<DeletePopupStoreType>()(
  immer((set) => {
    return {
      popupOpen: false,
      picturesToDeleteIds: [],
    };
  })
);

const emptyProductPageStore = {
  product: {
    title: "",
    description: "",
    price: 1,
    shippingTime: 1,
    stock: 1,
    categories: [],
    views: BigInt("0"),
    id: "",
    boughtCount: BigInt("0"),
    createdAt: new Date(),
    dealType: "NONE" as DealType,
    images: [],
    lastBoughtAt: new Date(),
    previewImageUrl: "",
    rating: 0,
    userId: "",
  },
  files: [],
  previewImageIdentificator: {
    name: "",
    size: 0,
  },
  isUpdating: false,
};

export const createProductPageStore = create<CreateProductPageStoreType>()(
  immer((set, get, store) => {
    const createProduct = async (): Promise<boolean> => {
      const product = get().product;
      const previewImageIdentificator = get().previewImageIdentificator;
      const files = get().files;

      const form = new FormData();
      form.append("title", product.title);
      form.append("description", product.description);
      form.append("shippingTime", `${product.shippingTime}`);
      form.append("stock", `${product.stock}`);
      form.append("price", `${product.price}`);
      form.append(
        "previewImageIdentificator",
        JSON.stringify(previewImageIdentificator)
      );

      const filesToSend = files.forEach((f) => {
        form.append("files", f.file);
      });

      const headers = new Headers();
      headers.append("Content-Type", "multipart/form-data");

      const respBody = JSON.stringify({
        title: product.title,
        description: product.description,
        files: form,
      });

      const uploadFilesResponse = await fetch("http://localhost:4500", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const uploadedFilesMapping: SavedFilesMapping =
        await uploadFilesResponse.json();

      const resp = await fetch("/api/file-test", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        try {
          const errMsg = await resp.json();
          if (errMsg.error) {
            toast.error(errMsg.error, {
              duration: 5000,
              position: "bottom-left",
            });
            return false;
          }
        } catch (e) {}
        toast.error("File upload failed!");
        return false;
      }
      const r = await resp.json();
      toast(JSON.stringify(r));

      if (createProductPageStore.getState().isUpdating) {
        toast.success("Product updated.");
      } else {
        toast.success("Product created.");
      }
      return true;
    };

    const resetStore = () => {
      set({
        ...emptyProductPageStore,
        createProduct,
        resetStore,
      });
      deletePopupStore.setState((state) => {
        state.picturesToDeleteIds = [];
      });
    };

    return {
      ...emptyProductPageStore,
      createProduct,
      resetStore,
    };
  })
);

const emptyUpdateProductPageStore = {
  categories: [],
  description: "",
  filesUrl: [],
  previewImageIdentificator: {
    name: "",
    size: 0,
  },
  price: 0,
  shippingTime: 0,
  stock: 0,
  title: "",
};
