'use strict';

import {attachAuthTokenToHeader, makeRequest} from "./utilites.js";

export { getFeedPosts, subscribeToChannel, NewFeedServiceClient };

function NewFeedServiceClient(baseURL) {
    const client = {
        baseURL,
        async getFeedPosts(username, token, {limit, offset, sorting, onlyIds = false} = {}) {
            return getFeedPosts(client.baseURL, username, token, {limit, offset, sorting, onlyIds});
        },
        async subscribeToChannel(username, channelname, authToken) {
            return subscribeToChannel(client.baseURL, username, channelname, authToken);
        }
    };
    return client;
}


async function getFeedPosts(
    baseURL, username, authToken,
    { limit, offset, sorting, onlyIds = false } = {}
) {
    let params = {};
    if (onlyIds) {
        params.onlyPKeys = true;
    }
    if (limit || offset) {
        params = {
            ...params,
            limit,
            offset,
        }
    }
    if (sorting) {
        params.sort = sorting;
    }
    let response = await makeRequest(
        `${baseURL}/users/${username}/feed/posts`,
        {
            headers: attachAuthTokenToHeader(authToken),
            params,
        });
    return response.data;
}

async function subscribeToChannel(baseURL, username, channelname, authToken) {
    return await makeRequest(
        `${baseURL}/users/${username}/feed/channels`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: {
                channelname
            }
        });
}