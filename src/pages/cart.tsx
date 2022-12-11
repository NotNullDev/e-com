import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
import { NiceButton } from "../components/NiceButton";
import type { FullCartItem } from "../lib/stores/cartStore";
import { cartStore } from "../lib/stores/cartStore";
import { trpc } from "../utils/trpc";

const getSellersFromCartProducts = (cartProducts: Product[]) => {
  const sellers = new Set<string>();
  cartProducts.forEach((product) => {
    sellers.add(product.userId);
  });
  return [...sellers];
};

const CartPage: NextPage = () => {
  const cart = cartStore((state) => state.items);
  const { data, status } = trpc.cart.getCartData.useQuery(
    cart.map((c) => ({ productId: c.productId, quantity: c.quantity }))
  );

  return (
    <div className="flex flex-1">
      <div className="flex flex-[2]">
        <div className="flex w-full flex-col gap-4  px-12">
          <h1 className="mb-4 text-3xl">Your cart</h1>
          {status === "success" &&
            data.map((p) => {
              return (
                <SellerProducts
                  sellerName={p.seller.name ?? "???"}
                  productsInfo={p.products}
                  key={p.seller.id}
                />
              );
            })}
        </div>
      </div>

      <div className="flex flex-1 flex-col ">
        <h1 className="mb-4 text-3xl">Summary</h1>
        <div className="flex flex-col gap-2"> </div>
        <>
          {status === "success" &&
            data.map((p) => {
              const sellerName = p.seller.name ?? "???";
              const productsCost = p.products.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
              );
              return (
                <SellerSummary
                  key={p.seller.id}
                  sellerName={sellerName}
                  productsCost={productsCost}
                />
              );
            })}
        </>
        <AllProductsCostSummary
          productsCost={
            data?.reduce(
              (sum, c) =>
                sum +
                c.products.reduce(
                  (sum1, c1) => sum1 + c1.price * c1.quantity,
                  0
                ),
              0
            ) ?? 0
          }
        />
        <button className="btn-primary btn mt-4">Checkout</button>
      </div>
    </div>
  );
};

export type SellerSummaryProps = {
  sellerName: string;
  productsCost: number;
};

const SellerSummary = ({ sellerName, productsCost }: SellerSummaryProps) => {
  return (
    <div className="flex w-full justify-between text-2xl">
      <h2 className="">{sellerName}</h2>
      <div className="">{productsCost} zl</div>
    </div>
  );
};

type AllProductsCostSummaryProps = {
  productsCost: number;
};

const AllProductsCostSummary = ({
  productsCost,
}: AllProductsCostSummaryProps) => {
  return (
    <div className="mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">
        {productsCost} zl
      </div>
    </div>
  );
};

type SellerProductsProps = {
  sellerName: string;
  productsInfo: FullCartItem[];
};

const SellerProducts = ({ sellerName, productsInfo }: SellerProductsProps) => {
  return (
    <div className=" w-full rounded-xl bg-base-200 p-4">
      <h1 className="mb-4 text-3xl">{sellerName}</h1>
      <div className="flex w-full flex-col gap-2">
        {productsInfo.map((p) => (
          <Product productInfo={p} key={p.id} />
        ))}
      </div>
      <SellerProductsCostSummary products={productsInfo} />
    </div>
  );
};

type ProductProps = {
  productInfo: FullCartItem;
};

const Product = ({ productInfo }: ProductProps) => {
  const [q, setQ] = useState(productInfo.quantity);
  return (
    <div className="flex w-full items-center justify-between rounded-xl p-3 px-6 text-2xl">
      <h2 className="">{productInfo.title}</h2>
      <div className="flex items-center gap-4">
        <NiceButton
          min={1}
          max={3}
          initial={q}
          callback={(u) => {
            setQ(u);
            cartStore.setState((state) => {
              const p = state.items.find(
                (i) => i.productId === productInfo.productId
              );
              if (p) {
                p.quantity = u;
              }
            });
          }}
        />
        <div className="w-[100px] text-right">{productInfo.price * q}</div>
      </div>
    </div>
  );
};

type SellerProductsCostSummaryProps = {
  products: FullCartItem[];
};

const SellerProductsCostSummary = ({
  products,
}: SellerProductsCostSummaryProps) => {
  return (
    <div className="mx-4 mt-4 flex justify-end text-right text-3xl">
      <div className="w-min w-[100px] whitespace-nowrap border-t pt-4 ">
        {products.reduce((sum, p) => sum + p.price * p.quantity, 0)} zl
      </div>
    </div>
  );
};

export default CartPage;
