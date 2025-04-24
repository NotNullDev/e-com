import {DefaultErrorShape, initTRPC, TRPCError} from "@trpc/server";
import superjson from "superjson";

import {type Context} from "./context";

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({shape}) {
        shape.data = {
            httpStatus: 500,
            code: 'INTERNAL_SERVER_ERROR',
            path: undefined,
            stack: undefined
        };
        shape.message = ""
        return {
            data: {
                code: 'INTERNAL_SERVER_ERROR',
                httpStatus: 500
            },
            message: '',
            code: -32603
        } satisfies DefaultErrorShape;
    },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ctx, next}) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({code: "UNAUTHORIZED"});
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: {...ctx.session, user: ctx.session.user},
        },
    });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
