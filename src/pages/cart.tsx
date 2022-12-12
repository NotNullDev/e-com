import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
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
  const session = useSession();
  const cart = cartStore(
    (state) => state.items,
    (a, b) => {
      return a.length === b.length;
    }
  );
  const router = useRouter();

  const { data, status } = trpc.cart.getCartData.useQuery(
    cart.map((c) => ({ productId: c.productId, quantity: c.quantity }))
  );

  const { success, canceled } = router.query;

  if (success) {
    return <div>Payment succeed</div>;
  }

  if (canceled) {
    return <div>Payment canceled</div>;
  }

  return (
    <div className="flex flex-1">
      <div className="flex flex-[2]">
        <div className="flex w-full flex-col gap-4  px-12">
          <h1 className="mb-4 text-3xl">Your cart</h1>
          {/* <button
            className="btn-primary btn"
            onClick={() => {
              cartStore.persist.clearStorage();
            }}
          >
            clear local storage
          </button> */}
          {status === "loading" && (
            <>
              {[...Array(3)].map((i) => {
                return (
                  <div
                    className="flex h-[300px] w-full animate-pulse flex-col gap-3 rounded-xl bg-base-300 p-4"
                    key={i}
                  >
                    <div className="mb-1 h-[30px] w-1/3 rounded-xl bg-base-100"></div>
                    <div className="flex justify-between">
                      <div className="m-3 h-[30px] w-1/2 rounded-xl bg-base-100"></div>
                      <div className="m-3 h-[30px] w-1/4 rounded-xl bg-base-100"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="m-3 h-[30px] w-1/2 rounded-xl bg-base-100"></div>
                      <div className="m-3 h-[30px] w-1/4 rounded-xl bg-base-100"></div>
                    </div>
                    <div className="flex justify-end">
                      <div className="m-3 h-[30px] w-1/4 rounded-xl bg-base-100"></div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {status === "success" &&
            data?.map((p) => {
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
        {true && (
          <>
            <h1 className="mb-4 text-3xl">Summary</h1>
            <div className="flex flex-col gap-2"> </div>
            <>
              {status === "success" &&
                data?.map((p) => {
                  const sellerName = p.seller.name ?? "???";
                  return (
                    <SellerSummary
                      key={p.seller.id}
                      sellerName={sellerName}
                      products={p.products}
                    />
                  );
                })}
            </>
            <AllProductsCostSummary
              products={data?.flatMap((c) => c.products) ?? []}
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
          </>
        )}
        {status === "loading" && <AllProductsSummarySkeleton />}
        <form action="/api/checkout-session" method="POST" className="w-full">
          <input hidden={true} name="data" value={JSON.stringify(cart)} />
          <button
            name="data"
            className="btn-primary btn mt-4 w-full"
            type="submit"
            onClick={(e) => {
              if (session.status !== "authenticated") {
                e.preventDefault();
                toast("You need to be logged in to checkout your cart");
              }
            }}
          >
            Checkout
          </button>
        </form>
      </div>
    </div>
  );
};

const AllProductsSummarySkeleton = () => {
  return (
    <div className="h-[200px]">
      <h1 className="mb-4 text-3xl">Summary</h1>
      <div className="flex flex-col gap-2"> </div>
      <div className="animate-pulse">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/2 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/3 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
          <div className="flex w-full justify-between text-2xl">
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
            <div className="h-[20px] w-1/4 rounded-xl bg-gray-700"></div>
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-end">
          <div className="flex w-1/4 flex-col">
            <div className="h-[2px] w-full animate-none bg-base-content"></div>
            <div className="mt-4 flex w-full justify-end text-3xl">
              <div className="h-[20px] w-full animate-pulse whitespace-nowrap rounded-xl bg-gray-700 pt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type SellerSummaryProps = {
  sellerName: string;
  products: FullCartItem[];
};

const SellerSummary = ({ sellerName, products }: SellerSummaryProps) => {
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

type AllProductsCostSummaryProps = {
  productsCost: number;
  products: FullCartItem[];
};

const AllProductsCostSummary = ({ products }: AllProductsCostSummaryProps) => {
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
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  return (
    <div className="flex w-full items-center justify-between rounded-xl p-3 px-6 text-2xl">
      <h2 className="">{productInfo.title}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <NiceButton
            min={1}
            max={3}
            initial={q}
            callback={(u) => {
              if (u === 1 && q === 1) {
                setDeletePopupOpen(true);
                return;
              }
              setDeletePopupOpen(false);
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
          {deletePopupOpen && (
            <div
              className="absolute bottom-0 left-0 flex translate-y-16 -translate-x-28 flex-col gap-2 rounded-xl bg-base-100 p-3 text-sm shadow-xl"
              key={productInfo.id}
            >
              <div>Delete item?</div>
              <div className="flex justify-end">
                <button
                  className="btn-error btn-sm btn"
                  onClick={() => {
                    setDeletePopupOpen(false);
                    setQ(0);
                    cartStore.setState((state) => {
                      const p = state.items.find(
                        (i) => i.productId === productInfo.productId
                      );
                      if (p) {
                        state.items = state.items.filter(
                          (i) => i.productId !== productInfo.productId
                        );
                      }
                    });
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn-ghost btn-sm btn"
                  onClick={() => {
                    setDeletePopupOpen(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
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

export default CartPage;
