import { useAtom } from "jotai";
import { CartAtoms } from "../../logic/common/cartStore";

export const SellerProductsCostSummary = () => {
  const [cartPriceSummary] = useAtom(CartAtoms.query.cartPriceSummary);
  return (
    <div className="mx-4 mt-4 flex justify-end text-right text-3xl">
      <div className="w-[100px] w-min whitespace-nowrap border-t pt-4 ">
        {cartPriceSummary} zl
      </div>
    </div>
  );
};
