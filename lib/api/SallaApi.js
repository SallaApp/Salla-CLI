const axios = require('axios');

/**
 * @property {string|undefined} accessToken
 */
class SallaApi {
    constructor() {
        this.baseEndpoint = 'https://s.salla.test/admin/v2/'; //https://api.salla.dev/admin/v2/
        this.endpoints = {
            user       : 'oauth2/user/info',
            new_draft  : 'theme',
            upload_file: 'theme/{theme_id}/upload',
        };

        //by default all methods are post, so if there is need to another method, set it here
        this.endpointsMethods = {
            user: 'get',
        }
    }

    request(endpoint, data, headers) {
        if (!this.endpoints[endpoint]) {
            throw 'Failed to find endpoint for: ' + endpoint;
        }
        let url = this.getUrlForEndpoint(endpoint, data);
        return this.getDataFromUrl(url, this.endpointsMethods[endpoint], data, headers)
    }

    /**
     * pass all endpoints from here to be free changing endpoints without breakChange
     * @param {string} endpoint
     * @param {undefined|{params:[string]}} endpoint
     * @return {string|undefined}
     */
    getUrlForEndpoint(endpoint, data) {
        let url = this.baseEndpoint + this.endpoints[endpoint];
        if (!data || !data.params || !Array.isArray(data.params)) {
            return url;
        }
        /**
         * in case there is parameters need to be replaced in url, user can pass them, we will handle replacement
         * @example
         * 'test/jamal/{id1}/{another}/edit'
         * we will run throw passed params in data object.
         * final result will be something like
         * 'test/jamal/100/56/edit'
         */
        const regex = /{[^{}]+}/i;
        data.params.forEach(param => url = url.replace(regex, /*urlParReplacement*/ param))
        return url;
    }

    getDataFromUrl(url, method, data, headers) {
        return axios({
            url    : url,
            method : method || 'post',
            data   : data,
            headers: {
                'Authorization'          : `Bearer ${this.accessToken}`,
                'CF-Access-Client-Id'    : '695ade2783e811dc18e23b2334ac886c.access',
                'CF-Access-Client-Secret': 'b2b925480ae38f3675525855dfcd934b811522263a3c9d7e99a0f9bd7bac86ac',
                ...(headers || {})
            },
        })
            .then(res => res.data)
            .catch(this.handleErrors);
    }

    handleErrors(error) {
        if (error && error.response && error.response.data) {
            let data = error.response.data;
            let errorMessage = `${error.name}: ${error.message}`;
            if (data.error && data.error.fields) {
                Object.entries(data.error.fields).forEach(([fieldName, errors]) => {
                    console.error(`- ${fieldName}: `.red, typeof errors === 'string' ? errors.red : errors);
                });
                return false;
            }
            if (data.error.message.includes('authorization token')) {
                console.error(`X Invalid authorization token, make sure to run: ${('salla theme auth').bold.cyan}`.red);
                return false;
            }
            if (data.error.message) {
                console.error(`X ${data.error.message}`.red);
                return false;
            }
            console.log(errorMessage.red);
            return false;
        }
        throw error;
    }
}

module.exports = SallaApi;