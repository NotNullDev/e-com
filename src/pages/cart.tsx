import type { NextPage } from "next";

const CartPage: NextPage = () => {
  return (
    <div className="flex flex-1 ">
      <div className="flex flex-[2] ">haha</div>
      <div className="flex flex-1 flex-col ">
        <h1 className="mb-4 text-3xl">Total</h1>
        <div className="flex flex-col gap-2">
          <SellerSummary />
          <SellerSummary />
          <SellerSummary />
          <SellerSummary />
        </div>
        <AllProductsCostSummary />
      </div>
    </div>
  );
};

const SellerSummary = () => {
  return (
    <div className="flex w-full justify-between text-2xl">
      <h2 className="">Seller 1</h2>
      <div className="">500 zl</div>
    </div>
  );
};

const AllProductsCostSummary = () => {
  return (
    <div className="mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">500 zl</div>
    </div>
  );
};

export default CartPage;
