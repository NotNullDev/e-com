import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
import { NiceButton } from "../components/NiceButton";
import type { FullCartItem } from "../lib/stores/cartStore";
import { cartStore } from "../lib/stores/cartStore";
import { getEmptyFilters } from "../lib/stores/productsStore";
import { trpc } from "../utils/trpc";

const getSellersFromCartProducts = (cartProducts: Product[]) => {
  const sellers = new Set<string>();
  cartProducts.forEach((product) => {
    sellers.add(product.userId);
  });
  return [...sellers];
};

const CartPage: NextPage = () => {
  const cartContent = cartStore((state) => state.items);

  const cartProductsReq = trpc.products.filtered.useQuery(
    {
      ...getEmptyFilters(),
      productIds: cartContent.map((item) => item.productId),
    },
    {
      enabled: cartContent.length > 0,
      initialData: [],
    }
  );

  const sellerIds = getSellersFromCartProducts(cartProductsReq.data ?? []);

  const sellers = trpc.users.getById.useQuery(
    { ids: sellerIds },
    {
      enabled: sellerIds.length > 0,
    }
  );

  return (
    <div className="flex flex-1 ">
      <div className="flex flex-[2]">
        <div className="flex w-full flex-col gap-4  px-12">
          <h1 className="mb-4 text-3xl">Your cart</h1>
          {!cartProductsReq?.data && <div>Loading...</div>}
          {sellers.data?.map((s) => {
            return (
              <SellerProducts
                sellerEmail={s.email ?? ""}
                productsInfo={
                  cartProductsReq.data
                    ?.filter((p) => p.userId === s.id)
                    .map((t) => ({
                      ...t,
                      productId: t.id,
                      quantity:
                        cartContent.find((c) => c.productId === t.id)
                          ?.quantity ?? 0,
                    })) ?? []
                }
                key={s.id}
              />
            );
          })}
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

type SellerProductsProps = {
  sellerEmail: string;
  productsInfo: FullCartItem[];
};

const SellerProducts = ({ sellerEmail, productsInfo }: SellerProductsProps) => {
  return (
    <div className=" w-full rounded-xl bg-base-200 p-4">
      <h1 className="mb-4 text-3xl">{sellerEmail}</h1>
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
        <div className="">{productInfo.price * q}</div>
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
    <div className="mx-4 mt-4 flex justify-end text-3xl">
      <div className="w-min whitespace-nowrap border-t pt-4">
        {products.reduce((sum, p) => sum + p.price * p.quantity, 0)} zl
      </div>
    </div>
  );
};

export default CartPage;
