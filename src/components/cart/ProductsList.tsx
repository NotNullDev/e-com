import type { FullCartItem } from "../../logic/common/cartStore";
import { Product } from "./ProductCart";
import { SellerProductsCostSummary } from "./ProductsCostSummary";

export type SellerProductsProps = {
  sellerName: string;
  productsInfo: FullCartItem[];
};

export const SellerProducts = ({
  sellerName,
  productsInfo,
}: SellerProductsProps) => {
  return (
    <div className=" w-full rounded-xl p-6 shadow shadow-gray-900">
      <h1 className="mb-4 text-3xl">{sellerName}</h1>
      <div className="flex w-full flex-col gap-2 shadow shadow-gray-900">
        {productsInfo.map((p) => (
          <Product productInfo={p} key={p.id} />
        ))}
      </div>
      <SellerProductsCostSummary products={productsInfo} />
    </div>
  );
};
