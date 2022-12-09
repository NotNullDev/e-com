import type { NextPage } from "next";
import { NiceButton } from "../components/NiceButton";

const CartPage: NextPage = () => {
  return (
    <div className="flex flex-1 ">
      <div className="flex flex-[2]">
        <div className="flex w-full flex-col px-6">
          <SellerProducts />
          <SellerProducts />
          <SellerProducts />
          <SellerProducts />
        </div>
      </div>
      <div className="flex flex-1 flex-col ">
        <h1 className="mb-4 text-3xl">Summary</h1>
        <div className="flex flex-col gap-2">
          <SellerSummary />
          <SellerSummary />
          <SellerSummary />
          <SellerSummary />
        </div>
        <AllProductsCostSummary />
        <button className="btn-primary btn mt-4">Checkout</button>
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

const SellerProducts = () => {
  return (
    <div className=" w-full">
      <h1 className="mb-4 text-3xl">Seller 1</h1>
      <div className="flex w-full flex-col gap-2">
        <Product />
        <Product />
        <Product />
        <Product />
      </div>
      <SellerProductsCostSummary />
    </div>
  );
};

const Product = () => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl p-3 px-6 text-2xl">
      <h2 className="">Product 1</h2>
      <div className="flex items-center gap-4">
        <NiceButton min={1} max={3} />
        <div className="">500 zl</div>
      </div>
    </div>
  );
};

const SellerProductsCostSummary = () => {
  return (
    <div className="mx-4 mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">500 zl</div>
    </div>
  );
};

export default CartPage;
