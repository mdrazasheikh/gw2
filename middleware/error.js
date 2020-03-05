export const errorHandler = async (ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.throw(404);
        }
    } catch (e) {
        ctx.status = e.status;
        ctx.body = e.message;
    }
};
