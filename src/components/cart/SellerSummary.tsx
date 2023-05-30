import { useAtom } from "jotai";
import type { FullCartItem } from "../../logic/common/cartStore";
import { CartAtoms } from "../../logic/common/cartStore";

export type SellerSummaryProps = {
  sellerName: string;
  products: FullCartItem[];
};

export const SellerSummary = ({ sellerName, products }: SellerSummaryProps) => {
  const [items] = useAtom(CartAtoms.query.cartItemsAtom);
  const productsCost = products.reduce(
    (sum, p) =>
      sum +
      p.price * (items.find((p1) => p1?.productId === p?.id)?.quantity ?? 0),
    0
  );

  return (
    <div className="flex w-full justify-between text-2xl">
      <h2 className="">{sellerName}</h2>
      <div className="">{productsCost} zl</div>
    </div>
  );
};
