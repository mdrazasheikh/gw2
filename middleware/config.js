/**
 * Global data handler class
 * Set data to the resource object and share across the application
 */
import _ from 'lodash';
import {environment} from "../config/config";
import {services} from "../config/services";

class Config {
    constructor() {
        this._valid = false;
    }

    get valid() {
        return this._valid;
    }

    set valid(status) {
        this._valid = status;
    }

    /**
     * Check if configurations are valid
     * @return {boolean}
     */
    isValid() {
        if (this.valid) {
            return true;
        }

        if (_.isEmpty(environment) || _.isEmpty(services) || _.isEmpty(services[environment])) {
            this.valid = false;
            return false;
        }

        this.valid = true;
        return true;
    }
}

export let config = new Config();
