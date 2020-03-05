import Http from "./http";
import {environment} from "../config/config";
import {services} from "../config/services";

class Catalog extends Http {
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
            return this.constructor.processException(e);
        }
    }

    prepareUrl() {
        let service = services[environment].catalog;
        let protocol = service.protocol,
            upstreamUrl = service.upstream_url;

        return `${protocol}://${upstreamUrl}/${this.request.url.replace(/^\/catalog\//i, '')}`;
    }
}

export default Catalog;