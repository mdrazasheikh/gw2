import {storeCodes} from "../config/services";

export const getStoreId = (request) => {
    return request.query['store_id'] ? request.query['store_id'] :
        request.body['store_id'] ? request.body['store_id'] :
            request.header['store_id'] ? request.header['store_id'] : '1';
};

export const getStoreCode = (request) => {
    return storeCodes[getStoreId(request).toString()];
};


export const getSessionId = (request) => {
    return request.header['authorization'] ? request.header['authorization'] :
        request.header['sid'] ? request.header['sid'] :
            request.query['sid'] ? request.query['sid'] :
                request.body['sid'] ? request.body['sid'] : '';
};