'use strict';

import { makeRequest } from "./utilites.js";

export { getAuthToken, NewAuthServiceClient };

// export const userServiceClient = NewUserServiceClient();

function NewAuthServiceClient(baseURL) {
    var client = {
        baseURL,
        async getAuthToken(username, password) {
            return getAuthToken(client.baseURL, username, password);
        },
    };
    return client;
}

async function getAuthToken(baseURL, username, password) {
    var response = await makeRequest(
        `${baseURL}/token-auth`,
        {
            method: 'post',
            data: { username, password }
        });
    return response.data.token;
}