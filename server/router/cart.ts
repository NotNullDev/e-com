import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { product, User, user } from "../../common/db/schema";
import { db } from "../../src/db/db";
import type { FullCartItem } from "../../src/logic/common/cartStore";
import { publicProcedure, router } from "../config/trpc";

export const cartRouter = router({
  getCartData: getCartData(),
});

export function getCartData() {
  return publicProcedure
    .input(
      z
        .object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
        })
        .array()
    )
    .query(async ({ ctx, input }) => {
      const resp = _getCartData(input);
      return resp;
    });
}

// TODO: we should only query for required data so we can do performant query
export const _getCartData = async (
  input: { productId: string; quantity: number }[]
) => {
  const cartResult: CartResponse[] = [];
  const productIds = input.map((item) => item.productId);

  const products = await db
    .select({
      product,
    })
    .from(product)
    .where(inArray(product.id, productIds));

  const users = await db
    .selectDistinct({
      user: user,
    })
    .from(user)
    .innerJoin(product, eq(user.id, product.userId))
    .where(inArray(product.id, productIds));

  for (const seller of users) {
    const productsForCurrentSeller = products.filter(
      (p) => p.product.userId === seller.user.id
    );

    cartResult.push({
      seller: seller.user,
      products: productsForCurrentSeller.map((p) => {
        const quantity =
          input.find((i) => i.productId === p.product.id)?.quantity ?? 0;
        return {
          ...p.product,
          productId: p.product.id,
          quantity: quantity,
        };
      }),
    });
  }

  return cartResult;
};

export type CartResponse = {
  seller: User;
  products: FullCartItem[];
};
