import { z } from "zod";
import { publicProcedure, router } from "../trpc";

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
});
