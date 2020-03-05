import _ from "lodash";
import request from "request-promise-native";
import {Error, SessionExpired} from "../Exceptions/ApiError";

class Http {

    static async request(options) {
        return await request(options);
    }

    static prepareOptions(data) {
        if (_.isEmpty(data['url']) || _.isEmpty(data['method'])) {
            throw new Error();
        }

        return {
            url: data['url'],
            method: data['method'],
            headers: data.headers,
            body: !_.isEmpty(data['body']) ? data['body'] : undefined,
            form: !_.isEmpty(data['form']) ? data['form'] : undefined,
            qs: !_.isEmpty(data['query']) ? data['query'] : undefined,
            json: typeof data['json'] !== 'undefined' && [true, false].includes(data['json']) ? data['json'] : true
        };
    }

    static processException(e) {
        let status, body;
        if (!_.isEmpty(e.response)) {
            if (!_.isEmpty(e.response.statusCode)) {
                status = e.response.statusCode;
            } else if (!_.isEmpty(e.response.status)) {
                status = e.response.status;
            }
            if (!_.isEmpty(e.response.body)) {
                body = e.response.body;
            }
        } else {
            body = e;
            status = 500;
        }

        if (status === 401) {
            throw new SessionExpired();
        }
        throw new Error(body, status);
    }
}

export default Http;