import type { FullCartItem } from "../../logic/common/cartStore";
import { cartStore } from "../../logic/common/cartStore";

export type SellerProductsCostSummaryProps = {
  products: FullCartItem[];
};

export const SellerProductsCostSummary = ({
  products,
}: SellerProductsCostSummaryProps) => {
  const items = cartStore((state) => state.items);
  const getQuantity = cartStore((state) => state.getQuantity);
  return (
    <div className="mx-4 mt-4 flex justify-end text-right text-3xl">
      <div className="w-min w-[100px] whitespace-nowrap border-t pt-4 ">
        {products.reduce((sum, p) => sum + p.price * getQuantity(p.id), 0)} zl
      </div>
    </div>
  );
};
