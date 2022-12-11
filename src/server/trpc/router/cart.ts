import type { PrismaClient, User } from "@prisma/client";
import { z } from "zod";
import type { FullCartItem } from "../../../lib/stores/cartStore";
import { publicProcedure, router } from "../trpc";

export type CartResponse = {
  seller: User;
  products: FullCartItem[];
};

export const cartRouter = router({
  getCartData: publicProcedure
    .input(
      z
        .object({
          productId: z.string().min(1),
          quantity: z.number().min(1),
        })
        .array()
    )
    .query(async ({ ctx, input }) => {
      const resp = getCartData(input, ctx.prisma);
      return resp;
    }),
});

export const getCartData = async (
  input: { productId: string; quantity: number }[],
  prisma: PrismaClient
) => {
  const productIds = input.map((item) => item.productId);

  const foundProducts = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      seller: true,
    },
  });

  const allSellers = foundProducts.map((p) => p.seller);

  const uniqueSellers = new Set(allSellers.map((p) => p.id));

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
