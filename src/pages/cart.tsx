import type { Product } from "@prisma/client";
import { useAtom } from "jotai";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { AllProductsCostSummary } from "../components/cart/AllProductsCostSummary";
import { AllProductsSummarySkeleton } from "../components/cart/AllProductsSummarySkeleton";
import { SellerProducts } from "../components/cart/ProductsList";
import { SellerSummary } from "../components/cart/SellerSummary";
import { CartAtoms } from "../logic/common/cartStore";
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
  const cartInputRef = useRef<HTMLInputElement>(null);
  const [cart] = useAtom(CartAtoms.query.cartAtom);
  const [items] = useAtom(CartAtoms.query.cartItemsAtom);
  const [, addItem] = useAtom(CartAtoms.mutation.addItemAtom);
  const [, clearCart] = useAtom(CartAtoms.mutation.clearCartAtom);
  const [, removeItem] = useAtom(CartAtoms.mutation.removeItemAtom);
  const [, triggerLoginSuggestion] = useAtom(
    CartAtoms.query.loginSuggestionAtom
  );
  const router = useRouter();

  const { data, status } = trpc.cart.getCartData.useQuery(
    items.map((c) => ({ productId: c.productId, quantity: c.quantity })),
    {
      onError: (err) => {
        clearCart();
      },
      retry: 1,
    }
  );

  useEffect(() => {
    if (status === "success" && data?.length !== cart.length) {
      // remove items from cart that are not in data
      const cartProductIds = cart.map((c) => c.productId);
      const dataProductIds =
        data?.flatMap((d) => d.products).map((p) => p.id) ?? [];
      const productIdsToRemove = cartProductIds.filter(
        (id) => !dataProductIds.includes(id)
      );
      productIdsToRemove.forEach((productId) => removeItem({ productId }));
    }
  }, [data, cart]);

  const { success, canceled } = router.query;

  useEffect(() => {
    if (success) {
      clearCart();
      toast.success("Payment succeed", {
        duration: 10000,
      });
    }
    if (canceled) {
      toast.error("Payment canceled", {
        duration: 10000,
      });
    }
  }, [success, canceled]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-[2]">
        <div className="flex w-full flex-col gap-4  px-12">
          <h1 className="mb-4 text-3xl">Your cart</h1>
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
      <div className="flex h-min flex-1 flex-col p-6 shadow shadow-gray-900">
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
            <AllProductsCostSummary />
          </>
        )}
        {status === "loading" && <AllProductsSummarySkeleton />}
        <form action="/api/checkout-session" method="POST" className="w-full">
          <input
            hidden={true}
            name="data"
            value={JSON.stringify(items)}
            ref={cartInputRef}
          />
          <button
            name="data"
            className="btn-primary btn mt-4 w-full"
            disabled={data?.length === 0}
            type="submit"
            onClick={(e) => {
              const recentCartValue = JSON.stringify(items);
              // put recent cart value into input above
              if (cartInputRef.current) {
                cartInputRef.current.value = recentCartValue;
              }
              if (session.status !== "authenticated") {
                e.preventDefault();
                toast("You need to be logged in to checkout your cart");
                triggerLoginSuggestion(true);
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

export default CartPage;
