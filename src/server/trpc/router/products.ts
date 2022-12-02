import type { Category } from "@prisma/client";
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
      const hottestProducts = await ctx.prisma.product.findMany({
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
      const hits = await ctx.prisma.product.findMany({
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
        category: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchQuery, limit, category } = input;

      const q =
        searchQuery === ""
          ? undefined
          : searchQuery
              .trim()
              .split(" ")
              .map((q) => (q += ":*"))
              .join(" & ") ?? ":*";

      const result = await ctx.prisma.product.findMany({
        where: {
          title: {
            search: q,
          },
        },
        take: limit,
      });

      console.log(`Found ${result?.length} entries.`);

      return result;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const itm = await ctx.prisma.product.findFirst({
        where: {
          id: {
            equals: input.id,
          },
        },
      });

      return itm;
    }),

  filtered: publicProcedure
    .input(
      z.object({
        titleContains: z.string(),
        categoriesIn: z.array(z.string()),
        limit: z.number().positive(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cat =
        input.categoriesIn.length > 0
          ? (input.categoriesIn as Category[])
          : undefined;

      const products = await ctx.prisma.product.findMany({
        where: {
          title: {
            contains: input.titleContains,
          },
          ...(input.categoriesIn.length > 0
            ? {
                AND: {
                  categories: {
                    equals: cat,
                  },
                },
              }
            : {}),
        },
        take: input.limit,
        orderBy: {
          createdAt: "asc",
        },
      });

      return products;
    }),
});
