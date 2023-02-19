import type { FullCartItem } from "../../logic/common/cartStore";
import { cartStore } from "../../logic/common/cartStore";

export type SellerSummaryProps = {
  sellerName: string;
  products: FullCartItem[];
};

export const SellerSummary = ({ sellerName, products }: SellerSummaryProps) => {
  const items = cartStore((state) => state.items);
  const getQuantity = cartStore((state) => state.getQuantity);
  const productsCost = products.reduce(
    (sum, p) => sum + p.price * getQuantity(p.id),
    0
  );

  return (
    <div className="flex w-full justify-between text-2xl">
      <h2 className="">{sellerName}</h2>
      <div className="">{productsCost} zl</div>
    </div>
  );
};
