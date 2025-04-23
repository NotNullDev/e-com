import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "../config/trpc";
import {user} from "../../common/db/schema";
import {inArray} from "drizzle-orm";

export const userRouter = router({
    getById: getUserById(),
    createConverstation: createConversation(),
});

function createConversation() {
    return protectedProcedure
        .input(
            z.object({
                title: z.string(),
                participantsIds: z.string().array(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const {db, session} = ctx;


            throw new Error("Not implemented")

            // const result = await db.insert.c.create({
            //     data: {
            //         title: input.title,
            //         participitants: {
            //             connect: [
            //                 ...input.participantsIds.map((id) => ({
            //                     id,
            //                 })),
            //             ],
            //         },
            //         owner: {
            //             connect: {
            //                 id: session.user.id,
            //             },
            //         },
            //     },
            // });
        });
}


function getUserById() {
    return publicProcedure
        .input(
            z.object({
                ids: z.string().array(),
            })
        )
        .query(({ctx, input}) => {
            return ctx.db.select().from(user).where(inArray(user.id, input.ids))
        });
}
