import { createProductPageStore } from "../../logic/create-products/createProductsPageStore";
import { NiceButton } from "../NiceButton";

export const ProductMetadata = () => {
  const shippingTime = createProductPageStore(
    (state) => state.product.shippingTime
  );
  const stock = createProductPageStore((state) => state.product.stock);
  const price = createProductPageStore((state) => state.product.price);

  return (
    <>
      <div className="flex gap-3">
        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px]">Price</div>
          <NiceButton
            min={1}
            max={9999}
            initial={price}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.price = p;
              });
            }}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px]">Stock</div>
          <NiceButton
            min={0}
            initial={stock}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.stock = p;
              });
            }}
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl p-2 px-4 shadow-sm shadow-gray-900">
          <div className="w-[100px] whitespace-nowrap">Shipping Time</div>
          <NiceButton
            min={0}
            initial={shippingTime}
            callback={(p) => {
              createProductPageStore.setState((state) => {
                state.product.shippingTime = p;
              });
            }}
          />
        </div>
      </div>
    </>
  );
};
