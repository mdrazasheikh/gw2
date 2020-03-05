import _ from 'lodash';
import Http from "./http";
import {environment} from "../config/config";
import {services} from "../config/services";
import {filterEmpty} from "../helpers/common";
import {ServiceUnavailable} from "../Exceptions/ApiError";

class Common extends Http {
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
        return options;
        try {
            return await this.constructor.request(options);
        } catch (e) {
            return this.constructor.processException(e);
        }
    }

    prepareUrl() {
        let pathPieces = this.request.path.split('/'),
            serviceName = filterEmpty(pathPieces)[0];

        if (_.isEmpty(services[environment][serviceName])) {
            throw new ServiceUnavailable();
        }

        let service = services[environment][serviceName];
        let protocol = service.protocol,
            upstreamUrl = service.upstream_url;

        return `${protocol}://${upstreamUrl}/${this.request.url.replace(new RegExp(`^/${serviceName}/`, 'i'), '')}`;
    }
}

export default Common;