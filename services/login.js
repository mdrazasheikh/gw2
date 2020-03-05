import _ from "lodash";
import {environment} from "../config/config";
import Http from "./http";
import {ServiceUnavailable} from "../Exceptions/ApiError";
import {services} from "../config/services";

class Login extends Http {
    constructor(request, state) {
        super();
        this.request = request;
        this.state = state;
    }

    async execute() {
        let options = this.constructor.prepareOptions({
            url: this.constructor.prepareUrl(),
            method: 'POST',
            headers: this.state.requestHeaders,
            form: this.request.body
        });

        let response;
        try {
            response = await this.constructor.request(options);
        } catch (e) {
            return this.constructor.processException(e);
        }

        if (!_.isEmpty(response) && !_.isEmpty(response['result'])) {
            return response['result'];
        } else {
            throw new ServiceUnavailable('Service unavailable', 503);
        }
    }

    static prepareUrl() {
        let service = services[environment].login;
        let protocol = service.protocol,
            upstreamUrl = service.upstream_url;

        return `${protocol}://${upstreamUrl}`;
    }
}

export default Login;