import Http from "./http";
import {environment} from "../config/config";
import {services} from "../config/services";
import {Error, SessionExpired} from "../Exceptions/ApiError";

class Store extends Http {
    constructor(request, state) {
        super();
        this.request = request;
        this.state = state;
    }

    async execute() {
        let options = this.constructor.prepareOptions({
            url: this.prepareUrl(),
            method: 'GET',
            headers: this.state.requestHeaders
        });

        try {
            return await this.constructor.request(options);
        } catch (e) {
            if (e.response.statusCode === 401) {
                throw new SessionExpired();
            }
            throw new Error(e.response.body, e.response.statusCode);
        }
    }

    prepareUrl() {
        let service = services[environment].store;
        let protocol = service.protocol,
            upstreamUrl = service.upstream_url;


        return `${protocol}://${upstreamUrl}/${this.request.url.replace(/^\/store\//i, '')}`;
    }
}

export default Store;