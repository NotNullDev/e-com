import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";
import { useUpsertProduct } from "../../logic/create-products/hooks";

export const CreateProductButton = () => {
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
