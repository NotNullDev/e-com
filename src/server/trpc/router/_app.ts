import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoriesRouter } from "./categories";
import { exampleRouter } from "./example";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  categories: categoriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
