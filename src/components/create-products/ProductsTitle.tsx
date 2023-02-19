import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";

export const ProductTitle = () => {
  const val = createProductPageStore((state) => state.product.title);
  return (
    <input
      value={val}
      placeholder="Product title"
      className="input-bordered input text-3xl"
      onChange={(e) => {
        createProductPageStore.setState((state) => {
          state.product.title = e.currentTarget.value;
        });
      }}
    />
  );
};
