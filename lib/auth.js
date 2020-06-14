'use strict';

import { makeRequest, attachAuthTokenToHeader } from "./utilites.js";

export {
    NewAuthServiceClient,
    getAuthToken,
    refreshAuthToken,
    logout
};

// export const userServiceClient = NewUserServiceClient();

/**
 * Make a new Auth Service CLient that calls to the given url.
 * @param {string} baseURL 
 */
function NewAuthServiceClient(baseURL) {
    var client = {
        baseURL,
        /**
         * Fetch the JWT token for the specifed user.
         */
        async getAuthToken(username, password) {
            return getAuthToken(client.baseURL, username, password);
        },
        /**
         * Use the passed in token to get a new, fresher, token.
         */
        async refreshAuthToken(authToken) {
            return refreshAuthToken(client.baseURL,authToken);
        },
        /**
         *Invalidate the given token to prevent further usage.
         * @see logout
         */
        async logout(authToken) {
            return logout(client.baseURL, authToken );
        },
    };
    return client;
}


/**
 * Fetch the JWT token for the specifed user.
 * @param {string} baseURL - Url to the issue-1-REST server.
 * @param {string} username - The username of the user to fetch the AuthToken for.
 * @param {string} password - The password of the user to fetch the AuthToken for.
 */
async function getAuthToken(baseURL, username, password) {
    var response = await makeRequest(
        `${baseURL}/token-auth`,
        {
            method: 'post',
            data: { username, password }
        });
    return response.data.token;
}


/**
 * Use the passed in token to get a new, fresher, token.
 * @param {string} baseURL 
 * @param {string} authToken
 */
async function refreshAuthToken(baseURL, authToken) {
    var response = await makeRequest(
        `${baseURL}/token-auth-refresh`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken)
        });
    return response.data.token;
}


/**
 * Invalidate the given token to prevent further usage.
 * @param {string} baseURL 
 * @param {string} authToken
 */
async function logout(baseURL, authToken) {
    var response = await makeRequest(
        `${baseURL}/logout`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken)
        });
    return response;
}