import _ from "lodash";
import Http from "./http";
import {ServiceUnavailable} from "../Exceptions/ApiError";

import {environment} from "../config/config";
import {services} from "../config/services";

class Auth extends Http {
    constructor(request, state) {
        super();
        this.request = request;
        this.state = state;
    }

    async execute() {
        let options = this.constructor.prepareOptions({
            url: this.constructor.prepareUrl(),
            method: 'GET',
            headers: this.state.requestHeaders
        });

        let response;
        try {
            response = await this.constructor.request(options);
        } catch (e) {
            return this.constructor.processException(e);
        }

        if (!_.isEmpty(response) && !_.isEmpty(response['result']) && !_.isEmpty(response['result']['sessiontoken'])) {
            return response['result'];
        } else {
            throw new ServiceUnavailable('Service unavailable', 503);
        }
    };

    static prepareUrl() {
        let service = services[environment].auth;
        let protocol = service.protocol,
            upstreamUrl = service.upstream_url;

        return `${protocol}://${upstreamUrl}`;
    }
}

export default Auth;