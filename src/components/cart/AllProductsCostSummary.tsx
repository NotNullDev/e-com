import { useAtom } from "jotai";
import type { FullCartItem } from "../../logic/common/cartStore";
import { CartAtoms } from "../../logic/common/cartStore";

export type AllProductsCostSummaryProps = {
  productsCost: number;
  products: FullCartItem[];
};

export const AllProductsCostSummary = () => {
  const [productsCost] = useAtom(CartAtoms.query.cartPriceSummary);

  return (
    <div className="mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">
        {productsCost} zl
      </div>
    </div>
  );
};
