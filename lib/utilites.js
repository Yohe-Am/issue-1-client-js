'use strict';

import axios from 'axios';

const CONNECTION_ERROR = Error("issue1.REST.client: connection could not be made with issue1 REST");

export { makeRequest, attachAuthTokenToHeader, CONNECTION_ERROR };

function attachAuthTokenToHeader(authToken, headers = {}) {
    if (!authToken) {
        return undefined;
    }
    // check if there's whitespace in authToken.
    // axios throws DOMExceptions for some issue instances in parsing 
    // headers. 
    else if(authToken.split(/\s/).length > 1){
        throw Error("Invalid authToken");
    }
    headers.Authorization = "Bearer " + authToken;
    return headers;
}


/**
 * Uses Axios to make a request according to the given config.
 * 
 * @param {string} URL Url of the server.
 * @param {object} requestConfig
 */
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
    try {
        let response = await axios(URL, config);
        // console.log('response:');
        // console.log(response);
        return response.data;
    } catch (error) {
        // throw error;

        var description = '';
        var response;
        // if there was a response
        // i.e. contanct was made with server
        if (!!error.response) {
            description += 'there was a response; ';

            // if there's a jSend object on response
            if (!!error.response.data) {
                if (!!error.response.data.status) {
                    // throw the jSend
                    let jSend = error.response.data;
                    jSend.errorCode = error.response.status;
                    throw jSend;
                }
            }
            // extract response data
            response = {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data,
            };
            // TODO: logging
        }
        // if there was a request
        // i.e if request was valid
        else if (!!error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js

            description += 'no response was received; ';

            // check if it's a connection error
            if (error.code == 'ENOTFOUND') {
                throw CONNECTION_ERROR;
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            description += 'setting up request failed; ';
        }

        // selectively pick out some of the information from the
        // axios error object
        var { message, name, nativeDescription: axiosDescription, number, code,
            config: {
                url, timeout,
                headers: requestHeaders,
                data: requestData,
                method: requestMethod,
                responseType: expectedType,
            },
        } = error.toJSON();

        // if there's a description on the axios error
        // add that to our custom description
        if (!!axiosDescription) {
            description += axiosDescription;
        }

        // throw a custom error
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