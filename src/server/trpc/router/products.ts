import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const productsRouter = router({
  getHottest: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const hottestProducts = await prisma?.product.findMany({
        where: {
          dealType: "HOT",
        },
        orderBy: {
          lastBoughtAt: "desc",
        },
        take: input.limit,
      });

      console.log(`received ${hottestProducts?.length}`);
      return hottestProducts;
    }),
  getHits: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const hits = await prisma?.product.findMany({
        where: {
          dealType: "HIT",
        },
        orderBy: {
          lastBoughtAt: "desc",
        },
        take: input.limit,
      });

      return hits;
    }),
});
