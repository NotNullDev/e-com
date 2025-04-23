import {TRPCError} from "@trpc/server";
import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "../config/trpc";
import {eComImagesAdminClient} from "../e-com-images-admin-client";
import {and, arrayOverlaps, asc, desc, eq, gte, ilike, inArray, SQL} from "drizzle-orm";
import type {SQLWrapper} from "drizzle-orm/sql/sql";
import type {PgColumn} from "drizzle-orm/pg-core";
import {Category, product} from "../../common/db/schema";

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

    getPreSingedUrlForFileUploadDemo: preSignUrlDemo(),

    getConversations: getConversation(),
});

function getConversation() {
    return protectedProcedure.query(async ({ctx, input}) => {
        const {db, session} = ctx;

        throw new Error("Not implemented");

        // // Get conversations with related data
        // const conversations = await db.query.conversation.findMany({
        //     where: (conversations, {eq, sql}) =>
        //         sql`${conversations.id} IN (
        //   SELECT "conversationId"
        //   FROM "_ConversationToUser"
        //   WHERE "userId" =
        //         ${session.user.id}
        //         )`,
        //     with: {
        //         messages: true,
        //         participants: true
        //     }
        // });

        // return conversations;
    });
}

function preSignUrlDemo() {
    return protectedProcedure.mutation(async ({ctx, input}) => {
        const token = await eComImagesAdminClient.getPresignUrl();
        return {
            token,
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
        .mutation(async ({ctx, input}) => {
            const {db, session} = ctx;

            if (input.id) {
                // Update existing product
                const existingProduct = await db.query.product.findFirst({
                    where: eq(product.id, input.id)
                });

                if (existingProduct) {
                    // Update product
                    const updatedProduct = await db
                        .update(product)
                        .set({
                            title: input.title,
                            description: input.description,
                            previewImageUrl: input.previewImageUrl,
                            price: input.price,
                            stock: input.stock,
                            shippingTime: input.shippingTimeDays,
                            categories: input.categories as Category[],
                            images: [...existingProduct.images, ...input.fileUrls]
                        })
                        .where(eq(product.id, input.id))
                        .returning({id: product.id});

                    return updatedProduct[0]?.id;
                }
            }

            // Insert new product
            const createdProduct = await db
                .insert(product)
                .values({
                    title: input.title,
                    description: input.description,
                    images: input.fileUrls,
                    previewImageUrl: input.previewImageUrl,
                    price: input.price,
                    stock: input.stock,
                    shippingTime: input.shippingTimeDays,
                    categories: input.categories as Category[],
                    userId: session?.user?.id,
                    dealType: "NONE",
                    boughtCount: 0,
                    rating: 0,
                    views: 0
                })
                .returning({id: product.id});

            return createdProduct[0]?.id;
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
        .mutation(async ({ctx, input}) => {
            const {db, session} = ctx;
            const {productId, urls} = input;

            await db
                .update(product)
                .set({
                    images: urls
                })
                .where(eq(product.id, productId));
        });
}

function deleteProducts() {
    return protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const {id} = input;
            const {db, session} = ctx;

            const productToDelete = await db.query.product.findFirst({
                where: eq(product.id, id)
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

            const deletedProduct = await db
                .delete(product)
                .where(eq(product.id, id))
                .returning();

            return deletedProduct[0];
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
        .query(async ({ctx, input}) => {
            const userId = ctx.session?.user?.id;

            if (!userId) {
                throw new Error("User is not logged in.");
            }

            const products = await ctx.db
                .select()
                .from(product)
                .where(eq(product.userId, userId))
                .limit(input.limit)
                .offset(input.offset);

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
        .query(async ({ctx, input}) => {
            const {db} = ctx;

            const filters: (SQLWrapper | undefined)[] = [
                ilike(product.title, `%${input.searchFilter}%`),
                gte(product.rating, input.rating),
            ];


            // Add categories filter if provided
            if (input.categoriesIn.length > 0) {
                filters.push(
                    arrayOverlaps(product.categories, input.categoriesIn as Category[])
                )
            }

            // Add product IDs filter if provided
            if (input.productIds.length > 0) {
                filters.push(
                    inArray(product.id, input.productIds)
                )
            }

            const order: (PgColumn | SQL | SQL.Aliased)[] = [];

            // Add sorting
            if (input.priceSort) {
                if (input.priceSort === "asc") {
                    order.push(asc(product.price))
                } else {
                    order.push(desc(product.price))
                }
            } else {
                order.push(asc(product.createdAt))
            }


            const query = db
                .select()
                .from(product)
                .where(
                    and(...filters)
                )
                .orderBy(...order)
                .limit(input.limit);

            const products = await query;

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
        .query(async ({ctx, input}) => {
            const item = await ctx.db.query.product.findFirst({
                where: eq(product.id, input.id)
            });

            return item;
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
        .query(async ({ctx, input}) => {
            const {searchQuery, limit, category} = input;
            const {db} = ctx;

            const filters: (SQLWrapper | undefined)[] = [];

            // Add search condition if provided
            if (searchQuery && searchQuery.trim() !== "") {
                // Drizzle doesn't have direct text search like Prisma,
                // so we'll use ilike for similarity
                filters.push(ilike(product.title, `%${searchQuery}%`));
            }

            // Add category condition if provided
            if (category) {
                filters.push(arrayOverlaps(product.categories, [category as Category]));
            }


            const query = db.select()
                .from(product)
                .where(
                    and()
                )
                .limit(limit);

            const result = await query;

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
        .query(async ({ctx, input}) => {
            const hits = await ctx.db
                .select()
                .from(product)
                .where(eq(product.dealType, "HIT"))
                .orderBy(desc(product.lastBoughtAt))
                .limit(input.limit);

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
        .query(async ({ctx, input}) => {
            const hottestProducts = await ctx.db
                .select()
                .from(product)
                .where(eq(product.dealType, "HOT"))
                .orderBy(desc(product.lastBoughtAt))
                .limit(input.limit);

            console.log(`received ${hottestProducts?.length}`);
            return hottestProducts;
        });
}