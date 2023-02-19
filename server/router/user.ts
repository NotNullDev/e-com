import type {Prisma} from "@prisma/client";
import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "../config/trpc";

export type UserSearchType = Prisma.UserAggregateArgs;

export const userRouter = router({
    getById: getUserById(),
    search: searchUser(),
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
            const {prisma, session} = ctx;

            const result = await prisma.conversation.create({
                data: {
                    title: input.title,
                    participitants: {
                        connect: [
                            ...input.participantsIds.map((id) => ({
                                id,
                            })),
                        ],
                    },
                    owner: {
                        connect: {
                            id: session.user.id,
                        },
                    },
                },
            });

            return result;
        });
}

function searchUser() {
    return publicProcedure
        .input({
            validateSync(input: any) {
                if (!(input satisfies
                UserSearchType
            ))
                {
                    throw new Error("Invalid input");
                }
                return input as UserSearchType;
            },
        })
        .query(async ({ctx, input}) => {
            const {prisma} = ctx;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore should be compatible
            const result = await prisma.user.findMany({
                ...input,
            });

            return result;
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
            return ctx.prisma.user.findMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });
        });
}
