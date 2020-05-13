'use strict';

import { get, post } from "./utilites.js";

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
    var url = `${baseURL}/users/${username}`;
    try {
        return await get(url);
    } catch (error) {
        throw error;
    }
}

async function addUser(baseURL, user) {
    var url = `${baseURL}/users`;
    try {
        return await post(url, user);
    } catch (error) {
        throw error;
    }
}
