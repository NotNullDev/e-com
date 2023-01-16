import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export type UserSearchType = Prisma.UserAggregateArgs;

export const userRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        ids: z.string().array(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
  search: publicProcedure
    .input({
      validateSync(input: any) {
        if (!(input satisfies UserSearchType)) {
          throw new Error("Invalid input");
        }
        return input as UserSearchType;
      },
    })
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      // @ts-expect-error should be compatible
      const result = await prisma.user.findMany({
        ...input,
      });

      return result;
    }),
  createConverstation: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        participantsIds: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;

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
    }),
});
