'use strict';

import axios from 'axios';

const CONNECTION_ERROR = Error("issue1.REST.client: connection could not be made with issue1 REST");

export { get, post, makeRequest, CONNECTION_ERROR };

async function get(URL) {
    return makeRequest(URL, 'get');
}

async function post(URL, data) {
    return makeRequest(URL, 'post', data);
}

async function makeRequest(URL, method = 'get', data = undefined, responseType = 'json', ) {
    var config = {
        method,
        url: URL,
        responseType
    };
    if (!!data) {
        config.data = data;
    }
    try {
        var response = await axios(config);
        return response.data;
    } catch (error) {
        // throw error;
        // console.log('Error', error);
        if (!!error.response) {
            if (!!error.response.data.status) {
                var errResponse = error.response.data;
                errResponse.errorCode = error.response.status;
                throw errResponse;
            }
            throw error.response;
            // TODO: logging
            // console.log(error.resoponse);
        } else if (!!error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // console.log(error.request);
            if (error.code == 'ENOTFOUND') {
                throw CONNECTION_ERROR;
            }
        }
        // Something happened in setting up the request that triggered an Error
        var { message, name, description, number, data: errData,
            config: { url, method: requestMethod, headers, timeout },
            code } = error.toJSON();
        throw {
            data: errData,
            message,
            name,
            url,
            method: requestMethod,
            headers,
            description,
            number,
            timeout,
            code
        };
    }
}


/* var client = NewClient();

function NewClient(baseURL, timeout = 5000) {
    var client = {
        axios: axios.create({
            baseURL,
            timeout,
        }),

    };
    return client;
}

function ReplaceDefaultClient(newClient) {
    client = newClient;
}
 */
// export { client as defaultClient, newClient, replaceDefaultClient };