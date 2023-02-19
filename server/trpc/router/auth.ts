import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You can now see this secret message!";
  }),
  signObject: protectedProcedure.input(z.any()).query(({ input }) => {
    let singedJWT = "";
    console.log(process.cwd());
    const file = fs.readFileSync(path.join(process.cwd(), "private.pem"));
    try {
      singedJWT = jwt.sign(input, file, { algorithm: "RS256" });
    } catch (e) {
      console.error(e);
    }
    return singedJWT;
  }),
});
