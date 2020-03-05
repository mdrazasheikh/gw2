import _ from "lodash";
import Router from "koa-router";
import Login from "./services/login";

import {version} from "./config/config";
import Auth from "./services/auth";
import {getSessionId, getStoreCode} from "./helpers/request";
import {NotFound} from "./Exceptions/ApiError";
import Store from "./services/store";
import Catalog from "./services/catalog";
import Meta from "./services/meta";
import Common from "./services/common";

const router = new Router();

router.use(async (ctx, next) => {
    if (ctx.path.toLowerCase().includes('store/account/auth') || ctx.path.toLowerCase().includes('store/account/login')) {
        throw new NotFound();
    }

    await next();
});

router.use(async (ctx, next) => {
    let removeHeaders = [
            'accept-encoding',
            'content-length',
            'cookie',
            'host',
            'accept-language',
            'x-user-session-token',
            'authorization'
        ],
        actualHeaders = ctx.headers,
        requestHeaders = {};

    for (let actualHeader in actualHeaders) {
        if (actualHeaders.hasOwnProperty(actualHeader)) {
            if (removeHeaders.indexOf(actualHeader) !== -1) {
                continue;
            }
            if (!removeHeaders.hasOwnProperty(actualHeader)) {
                requestHeaders[actualHeader] = actualHeaders[actualHeader];
            }
        }
    }

    let storeCode = getStoreCode(ctx.request),
        sessionId = getSessionId(ctx.request);

    if (!_.isEmpty(sessionId)) {
        requestHeaders['x-user-session-token'] = sessionId;
    }
    if (!_.isEmpty(storeCode)) {
        requestHeaders['store-code'] = storeCode;
    }

    ctx.state.requestHeaders = requestHeaders;
    ctx.state.storeCode = storeCode;
    ctx.state.sessionId = sessionId;

    await next();
    // extract required information and set to state
});
// defined routes
router.all('/', async (ctx) => {
    ctx.body = {
        'version': `${version}`
    };
});

// defined routes
router.all('/version', async (ctx) => {
    ctx.body = {
        'version': `${version}`
    };
});

// defined routes
router.get('/auth', async (ctx) => {
    let authService = new Auth(ctx.request, ctx.state);

    ctx.body = await authService.execute();
    ctx.status = 200;
});

router.post('/auth/login', async (ctx) => {
    let loginService = new Login(ctx.request, ctx.state);

    ctx.body = await loginService.execute();
    ctx.status = 200;
});

router.all(/^\/store\/(.*)(?:\/|$)/, async (ctx, next) => {
    let storeService = new Store(ctx.request, ctx.state);

    ctx.body = await storeService.execute();

    await next();
});

router.all(/^\/catalog\/(.*)(?:\/|$)/i, async (ctx, next) => {
    let storeService = new Catalog(ctx.request, ctx.state);

    ctx.body = await storeService.execute();

    await next();
});

router.all(/^\/meta\/(.*)(?:\/|$)/i, async (ctx, next) => {
    let storeService = new Meta(ctx.request, ctx.state);

    ctx.body = await storeService.execute();

    await next();
});

router.all(/^(?!(\/meta\/|\/catalog\/|\/store\/)).*$/i, async (ctx, next) => {
    let commonService = new Common(ctx.request, ctx.state);

    ctx.body = await commonService.execute();

    await next();
});

export default router;