import { z } from "zod";
import type { FullCartItem } from "../../src/logic/common/cartStore";
import { publicProcedure, router } from "../config/trpc";
import {db} from "../../src/db/db";
import {product, User, user} from "../../common/db/schema";
import {and, eq, inArray} from "drizzle-orm";

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

export const _getCartData = async (
    input: { productId: string; quantity: number }[],
) => {
    const productIds = input.map((item) => item.productId);


    const result = await db.select({
        product,
        userId: user.id
    }).from(product)
        .innerJoin(product, eq(user.id, product.id))
        .where(inArray(product.id, productIds))

    const allSellers = result.map(r => r.userId)

    const uniqueSellers = new Set(allSellers);

    const response = [...uniqueSellers]
        .map((sellerId) => {
            const seller = allSellers.find((s) => s.id === sellerId);
            if (!seller) {
                console.warn("Seller not found, ", JSON.stringify(input));
                return null;
            }
            const sellerProducts = foundProducts
                .filter((p) => p.seller.id === sellerId)
                .map((p) => {
                    const cartItem = input.find((i) => i.productId === p.id);
                    return {
                        ...p,
                        productId: p.id,
                        quantity: cartItem?.quantity ?? 0,
                    };
                });
            return {
                seller,
                products: sellerProducts,
            };
        })
        .filter((p) => p) as CartResponse[];

    return response;
};


export type CartResponse = {
  seller: User;
  products: FullCartItem[];
};
