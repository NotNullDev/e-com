import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";

export const ProductDescriptionEditor = () => {
  const description = createProductPageStore(
    (state) => state.product.description
  );

  return (
    <textarea
      className="textarea-bordered textarea w-full"
      value={description}
      onChange={(e) => {
        createProductPageStore.setState((store) => {
          store.product.description = e.target?.value ?? "";
        });
      }}
    />
  );
};
