import {createNextApiHandler} from "@trpc/server/adapters/next";
import {createContext} from "../../../../server/config/context";
import {appRouter} from "../../../../server/router/_app";

// export API handler
export default createNextApiHandler({
    router: appRouter,
    createContext,
    // onError:
    //     ({path, error}) => {
    //             console.error(`❌ tRPC failed on ${path}: ${error}`);
    //     }
});
