'use strict';

import { makeRequest, attachAuthTokenToHeader } from "./utilites.js";

export { getUser, addUser, NewUserServiceClient };

// export const userServiceClient = NewUserServiceClient();

function NewUserServiceClient(baseURL) {
    var client = {
        baseURL,
        async getUser(username, token) {
            return getUser(client.baseURL, username, token);
        },
        async addUser(user) {
            return addUser(client.baseURL, user);
        }
    };
    return client;
}

async function getUser(baseURL, username, token) {
    return (await makeRequest(
        `${baseURL}/users/${username}`,
        { headers: attachAuthTokenToHeader(token) }))
        .data;
}

async function addUser(baseURL, user) {
    return (await makeRequest(
        `${baseURL}/users`,
        { method: 'post', data: user }))
        .data;
}
