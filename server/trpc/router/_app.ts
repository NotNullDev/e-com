import { router } from "../trpc";
import { authRouter } from "./auth";
import { cartRouter } from "./cart";
import { categoriesRouter } from "./categories";
import { exampleRouter } from "./example";
import { productsRouter } from "./products";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  categories: categoriesRouter,
  products: productsRouter,
  users: userRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
