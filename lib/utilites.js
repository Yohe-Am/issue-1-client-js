'use strict';

import axios from 'axios';

const CONNECTION_ERROR = Error("issue1.REST.client: connection could not be made with issue1 REST");

export { makeRequest, attachAuthTokenToHeader, CONNECTION_ERROR };

function attachAuthTokenToHeader(authToken, headers = {}) {
    if (!authToken) return undefined;
    headers.Authorization = "Bearer " + authToken;
    return headers;
}

async function makeRequest(URL, { method = 'get', responseType = 'json', headers, data, params } = {}) {
    var config = {
        method,
        headers: {
            ...headers,
        },
        url: URL,
        responseType,
        data,
        params,
        // mode: "cors",
        // body: JSON.stringify(data),
    };
    // console.log(config);
    try {
        let response = await axios(URL, config);
        // console.log('response:');
        // console.log(response);
        return response.data;
    } catch (error) {
        // throw error;
        var description = '';
        var response;
        if (!!error.response) {
            if (!!error.response.data.status) {
                let errResponse = error.response.data;
                errResponse.errorCode = error.response.status;
                throw errResponse;
            }
            description += 'there was a response; ';
            response = {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data,
            };
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
            description += 'no response was received; ';
        } else {
            // Something happened in setting up the request that triggered an Error
            description += 'setting up request failed; ';
        }
        // throw error.toJSON();
        var { message, name, nativeDescription, number, code,
            config: {
                url, timeout,
                headers: requestHeaders,
                data: requestData,
                method: requestMethod,
                responseType: expectedType,
            },
        } = error.toJSON();
        if (!!nativeDescription) {
            description += nativeDescription;
        }
        throw {
            message,
            name,
            description,
            response,
            request: {
                url,
                method: requestMethod,
                headers: requestHeaders,
                data: requestData,
                timeout,
                responseType: expectedType,
            },
            number,
            code,
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