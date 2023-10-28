import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import type { z } from "zod";
import {
  createProductZodValidationObject,
  createProductZodValidationObjectWihtoutImages,
} from "../../../common/zodValidators";
import { EXISTING_IMAGE } from "../../utils/CONST";
import { Converters } from "../../utils/convertes";
import { trpc } from "../../utils/trpc";
import { createProductPageStore } from "./createProductsPageStore";
import {eComImagesClient} from "../../lib/e-com-images-client";

export const useUpsertProduct = () => {
  const createProductMutation = trpc.products.upsertProduct.useMutation();
  const uploadImagesMutation = useUploadImagesMutationDemo();
  const trpcContext = trpc.useContext();
  const isUpdating = createProductPageStore((s) => s.isUpdating);
  const router = useRouter();

  const upsertProduct = async () => {
    toast.remove();

    const productToCreate = {
      id: createProductPageStore.getState().product.id ?? null,
      title: createProductPageStore.getState().product.title,
      description: createProductPageStore.getState().product.description,
      price: createProductPageStore.getState().product.price,
      stock: createProductPageStore.getState().product.stock,
      shippingTimeDays: createProductPageStore.getState().product.shippingTime,
      categories: createProductPageStore
        .getState()
        .product.categories.map((c) => Converters.stringToCategory(c)),
      fileUrls: [],
      previewImageUrl: "",
    } as z.infer<typeof createProductZodValidationObject>;

    let result =
      createProductZodValidationObjectWihtoutImages.safeParse(productToCreate);

    if (!result.success) {
      result.error.errors.map((error) => {
        toast.error(`${error.path} ${error.message}`, {
          position: "bottom-left",
          duration: 10000,
        });
      });
      return;
    }

    const mapping = await uploadImagesMutation.mutateAsync(
      createProductPageStore.getState().files.map((f) => f.file) ?? [],
      {
        onError: (err) => {
          console.log(err);
          toast("Could not upload images to the file server.");
        },
      }
    );

    let previewImageUrl =
      createProductPageStore.getState().product.previewImageUrl;

    if (!previewImageUrl) {
      previewImageUrl =
        mapping.find(
          (img) =>
            img.originalFileName ===
            createProductPageStore.getState().previewImageIdentificator.name
        )?.fileUrl ?? "";
    }

    const newFileNames = mapping.map((m) => m.fileUrl);

    productToCreate.fileUrls = newFileNames ?? [];

    if (previewImageUrl === "") {
      if (
        productToCreate.fileUrls.length === 0 ||
        !productToCreate.fileUrls[0] ||
        productToCreate.fileUrls[0] === ""
      ) {
        toast.error("You must upload at least one image.");
        return;
      }
      previewImageUrl = productToCreate.fileUrls[0];
    }

    productToCreate.previewImageUrl = previewImageUrl;

    result = createProductZodValidationObject.safeParse(productToCreate);

    if (!result.success) {
      result.error.errors.map((error) => {
        toast.error(`${error.path} ${error.message}`, {
          position: "bottom-left",
          duration: 10000,
        });
      });
      return;
    }

    const mutationResult = await createProductMutation.mutateAsync(
      productToCreate
    );

    if (mutationResult) {
      if (isUpdating) {
        toast.success("Product updated successfully.");
      } else {
        toast.success("Product created successfully.");
      }
      router.push("/account");
      await trpcContext.products.getOwnProducts.invalidate();
      createProductPageStore.getState().resetStore();
    }
  };

  return {
    upsertProduct,
  };
};

export const useUploadImagesMutationDemo = () => {
  const preSingedUrlMutation =
    trpc.products.getPreSingedUrlForFileUploadDemo.useMutation();

  const upload = async (images: File[]) => {
    const result = [];
    const form = new FormData();
    for (const image of images) {
      if (image && image.name !== "") {
        form.append("files", image);
      }
    }

    for (const img of images) {
      if (img.name === EXISTING_IMAGE) {
        continue;
      }
      const {token} = await preSingedUrlMutation.mutateAsync();

      if (!token) {
        throw new Error(
          `Could not get presigned url for image ${img.name} from the file server.`
        );
      }

      const imageId = await eComImagesClient.uploadImage(img, token);
      if (!imageId) {
        throw new Error(
          `Could not upload image ${img.name} to the file server.`
        );
      }

      const imageUrl = eComImagesClient.getImageUrl(imageId);

      result.push({originalFileName: img.name, fileUrl: imageUrl});
    }
    return result;
  };

  const uploadMutation = useMutation(["uploadImage"], upload);

  return uploadMutation;
}

export const useInitProductPage = () => {
  const router = useRouter();
  const productId = router.query.id as string;
  const trpcContext = trpc.useContext();
  const { data: product } = trpc.products.byId.useQuery(
    {
      id: productId ?? "",
    },
    {
      onSuccess: async (data) => {
        if (data) {
          createProductPageStore.getState().resetStore();
          createProductPageStore.setState((state) => {
            state.product = data;
            state.isUpdating = true;
          });

          // TODO: it is not most efficient way to do this xD
          for (const url of data.images) {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], EXISTING_IMAGE, {
              type: blob.type,
            });

            createProductPageStore.setState((state) => {
              state.files.push({
                url,
                file,
              });
            });
          }
        }
      },
    }
  );

  useEffect(() => {
    createProductPageStore.getState().resetStore();
    if (productId) {
      trpcContext.products.invalidate();
    }
  }, [productId]);
};
