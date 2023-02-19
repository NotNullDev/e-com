import type { FullCartItem } from "../../logic/common/cartStore";
import { cartStore } from "../../logic/common/cartStore";

export type AllProductsCostSummaryProps = {
  productsCost: number;
  products: FullCartItem[];
};

export const AllProductsCostSummary = ({
  products,
}: AllProductsCostSummaryProps) => {
  const items = cartStore((state) => state.items);
  const getQuantity = cartStore((state) => state.getQuantity);
  const productsCost = products.reduce(
    (sum, p) => sum + p.price * getQuantity(p.id),
    0
  );
  return (
    <div className="mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">
        {productsCost} zl
      </div>
    </div>
  );
};
