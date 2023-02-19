import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import {z} from "zod";
import {protectedProcedure, publicProcedure, router} from "../config/trpc";

export const authRouter = router({
    getSession: getSession(),

    signObject: signObject(),
});

function getSession() {
    return publicProcedure.query(({ctx}) => {
        return ctx.session;
    });
}

function signObject() {
    return protectedProcedure.input(z.any()).query(({input}) => {
        let singedJWT = "";
        console.log(process.cwd());
        const file = fs.readFileSync(path.join(process.cwd(), "private.pem"));
        try {
            singedJWT = jwt.sign(input, file, {algorithm: "RS256"});
        } catch (e) {
            console.error(e);
        }
        return singedJWT;
    });
}
