import type { Category, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

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
          ...(category
            ? {
                categories: {
                  has: category as Category,
                },
              }
            : {}),
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
        priceSort: z.string().nullable(),
        rating: z.number(),
        productIds: z.string().array(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cat =
        input.categoriesIn.length > 0
          ? (input.categoriesIn as Category[])
          : undefined;

      let sort = [
        { createdAt: "asc" },
      ] as Prisma.Enumerable<Prisma.ProductOrderByWithRelationAndSearchRelevanceInput>;

      if (input.priceSort) {
        sort = [{ price: input.priceSort as Prisma.SortOrder }];
      }

      const categoriesFilter = {
        ...(input.categoriesIn.length > 0
          ? {
              categories: {
                equals: cat,
              },
            }
          : {}),
      };

      const pIds = {
        ...(input?.productIds?.length > 0
          ? {
              id: {
                in: input.productIds,
              },
            }
          : {}),
      };

      const q = {
        where: {
          title: {
            contains: input.titleContains,
            mode: "insensitive",
          },
          AND: [
            {
              rating: {
                gte: input.rating,
              },
            },
            { ...categoriesFilter },
            { ...pIds },
          ],
        },
        take: input.limit,
        orderBy: sort,
      } as Parameters<typeof ctx.prisma.product.findMany>[0];

      const products = await ctx.prisma.product.findMany(q);

      return products;
    }),

  getOwnProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1),
        offset: z.number().min(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const products = await ctx.prisma.product.findMany({
        where: {
          seller: {
            id: {
              equals: ctx.session?.user?.id,
            },
          },
        },
        take: input.limit,
        skip: input.offset,
      });

      return products;
    }),

  deleteProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const { prisma, session } = ctx;

      const productToDelete = await prisma.product.findFirst({
        where: {
          id: {
            equals: id,
          },
        },
      });

      if (!productToDelete) {
        throw new TRPCError({
          message: "Invalid product id.",
          code: "NOT_FOUND",
        });
      }

      if (productToDelete.userId !== session.user.id) {
        throw new TRPCError({
          message: "You cannot delete product that is not yours.",
          code: "UNAUTHORIZED",
        });
      }

      const a = await prisma.product.delete({
        where: {
          id: id,
        },
      });

      return a;
    }),
});
