import {publicProcedure, router} from "../config/trpc";

const categoires = [
    "Electronics",
    "Fashion",
    "Sport",
    "Toys and hobbies",
    "Health",
];

export const categoriesRouter = router({
    getAll: publicProcedure.query(({ctx, input}) => {
        return categoires;
    }),
});
