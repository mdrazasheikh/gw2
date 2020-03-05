import {maintenanceMode} from '../config/config';

export const maintenanceHandler = async (ctx, next) => {
    if (maintenanceMode === true) {
        ctx.status = 503;
        // retry after header
        ctx.body = {
            'server_maintenance': '1',
            'html': ''
        };
        return;
    }
    await next();
};