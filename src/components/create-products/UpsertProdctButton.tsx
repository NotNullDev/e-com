import { useRouter } from "next/router";
import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";
import {
  useUploadImagesMutation,
  useUpsertProduct,
} from "../../logic/create-products/hooks";
import { trpc } from "../../utils/trpc";

export const CreateProductButton = () => {
  const router = useRouter();
  const trpcContext = trpc.useContext();
  const createProductMutation = trpc.products.upsertProduct.useMutation();
  const uploadImagesMutation = useUploadImagesMutation();
  const isUpdating = createProductPageStore((s) => s.isUpdating);
  const { upsertProduct } = useUpsertProduct();

  return (
    <>
      <div className="mt-3 flex w-full justify-end">
        <div className="btn-primary btn" onClick={() => upsertProduct()}>
          {isUpdating ? "Update" : "Create"}
        </div>
      </div>
    </>
  );
};
