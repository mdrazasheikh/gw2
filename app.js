import Koa from "koa";
import router from "./routes";
import bodyParser from "koa-bodyparser";

import {errorHandler} from "./middleware/error";
import {maintenanceHandler} from "./middleware/maintenance";
import {config} from "./middleware/config";

const app = new Koa();

if (!config.isValid()) {
    throw new Error('Invalid Configuration');
}

app.use(errorHandler);
app.use(maintenanceHandler);
// initialize body parser
app.use(
    bodyParser({
        enableTypes: ["json", "form"],
        formLimit: "10mb",
        jsonLimit: "10mb"
    })
);

app.use(router.routes());
app.use(router.allowedMethods({
        throw: true,
        notImplemented: () => new ApiError('Not implemented', 404),
        methodNotAllowed: () => new new ApiError('Not allowed', 403)
    }
));

export default app;