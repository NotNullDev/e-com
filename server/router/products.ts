import type { Category, Conversation, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "node:crypto";
import toast from "react-hot-toast";
import { z } from "zod";
import { getPreSignedUrl } from "../common/fileUploader";
import { protectedProcedure, publicProcedure, router } from "../config/trpc";
import {eComImagesAdminClient} from "../e-com-images-admin-client";

export const productsRouter = router({
  getHottest: getHottestProducts(),

  getHits: getHits(),

  searchForProduct: searchForProduct(),

  byId: findProductById(),

  filtered: getAllProductsFiltered(),

  getOwnProducts: getOwnProducts(),

  deleteProduct: deleteProducts(),

  setImages: updateImages(),

  upsertProduct: upsertProducts(),

  getPreSingedUrlForFileUpload: preSignUrl(),
  getPreSingedUrlForFileUploadDemo: preSignUrlDemo(),

  getConversations: getConversation(),
});

export type CreateProductModel = {
  title: string;
  description: string;
  fileUrls: string;
  previewImageUrl: string;
  price: number;
  stock: number;
  shippingTimeDays: number;
  categories: Category[];
  userId: string;
};

function getConversation() {
  return protectedProcedure.query(async ({ ctx, input }) => {
    const { prisma, session } = ctx;

    const conversations = await prisma.conversation.findMany({
      where: {
        participitants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        messages: true,
        participitants: true,
      },
    });

    return conversations as Conversation[];
  });
}

function preSignUrl() {
  return protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      console.log(
        `User ${user.email} requested presigned url for file upload.`
      );

      const randomFilename = `${input.fileName}-${randomUUID()}`;

      const presignedurl = await getPreSignedUrl(randomFilename);

      console.log(`Presigned url: ${presignedurl}`);
      let fileUrl;

      fileUrl = `http://localhost:9000/e-com/${randomFilename}`;

      fileUrl = `https://minio.notnulldev.com/e-com/${randomFilename}`;

      return {
        presignedurl,
        fileUrl,
      };
    });
}

function preSignUrlDemo() {
  return protectedProcedure
    .mutation(async ({ctx, input}) => {
      const token = await eComImagesAdminClient.getPresignUrl();
      return {
        token
      };
    });
}

function upsertProducts() {
  return protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        title: z.string(),
        description: z.string(),
        fileUrls: z.array(z.string()),
        previewImageUrl: z.string(),
        price: z.number(),
        stock: z.number(),
        shippingTimeDays: z.number(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdProduct = await ctx.prisma.product.upsert({
        where: {
          id: input.id ?? "",
        },
        create: {
          title: input.title,
          description: input.description,
          images: input.fileUrls,
          previewImageUrl: input.previewImageUrl,
          price: input.price,
          stock: input.stock,
          shippingTime: input.shippingTimeDays,
          categories: input.categories as Category[],
          userId: ctx.session?.user?.id,
          dealType: "NONE",
          boughtCount: 0,
          rating: 0,
          views: 0,
        },
        update: {
          title: input.title,
          description: input.description,
          images: {
            push: input.fileUrls,
          },
          previewImageUrl: input.previewImageUrl,
          price: input.price,
          stock: input.stock,
          shippingTime: input.shippingTimeDays,
          categories: input.categories as Category[],
        },
        select: {
          id: true,
        },
      });

      return createdProduct.id;
    });
}

function updateImages() {
  return protectedProcedure
    .input(
      z.object({
        urls: z.array(z.string()),
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { productId, urls } = input;

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          images: {
            set: urls,
          },
        },
      });
    });
}

function deleteProducts() {
  return protectedProcedure
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
    });
}

function getOwnProducts() {
  return publicProcedure
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
    });
}

function getAllProductsFiltered() {
  return publicProcedure
    .input(
      z.object({
        searchFilter: z.string(),
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
            contains: input.searchFilter,
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
    });
}

function findProductById() {
  return publicProcedure
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
    });
}

function searchForProduct() {
  return publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        limit: z.number().min(1),
        category: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { searchQuery, limit, category } = input;

      toast("Aa");

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
    });
}

function getHits() {
  return publicProcedure
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
    });
}

function getHottestProducts() {
  return publicProcedure
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
    });
}
