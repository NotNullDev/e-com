import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const productsRouter = router({
  getHottest: publicProcedure
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
  getHits: publicProcedure
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
  searchForProduct: publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        limit: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchQuery, limit } = input;

      const result = await prisma?.product.findMany({
        where: {
          title: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        take: limit,
      });

      console.log(`Found ${result?.length} entries.`);

      return result;
    }),
});
