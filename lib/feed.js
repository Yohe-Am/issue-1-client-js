'use strict';

import {attachAuthTokenToHeader, makeRequest} from "./utilites.js";
import {generateQueryParams} from "./utilites";

export {
    getFeedPosts,
    getFeed,
    getFeedSubscriptions,
    setDefaultFeedSorting,
    subscribeFeedToChannel,
    unsubscribeFeedFromChannel,
    NewFeedServiceClient
};


/**
 * @typedef Feed - object that describes a user's feed.
 * @property {number} id
 * @property {string} ownerUsername
 * @property {string} defaultSorting - either 'hot', 'new' or 'top'
 */

function NewFeedServiceClient(baseURL) {
    const client = {
        baseURL,
        /**
         * Get posts from the user's feed sorted and paginated according to the given parameters.
         */
        async getFeedPosts(username, token, {limit, offset, sorting, onlyIds = false} = {}) {
            return getFeedPosts(client.baseURL, username, token, {limit, offset, sorting, onlyIds});
        },
        /**
         * Returns the sorting setting for the feed of the given user.
         */
        async getFeed(username, authToken) {
            return getFeed(client.baseURL, username, authToken);
        },
        /**
         * Returns a list of channels from the given's user feed sorted according to the the passed parameters.
         */
        async getFeedSubscriptions(baseURL, username, authToken,
                                   {limit, offset, sortingOrder, sortParameter} = {}) {
            return getFeedSubscriptions(client.baseURL, username, authToken, {
                limit,
                offset,
                sortingOrder,
                sortParameter
            })
        },
        /**
         * Sets the default sorting method for the feed of the given user.
         */
        async setDefaultFeedSorting(baseURL, username, defaultSorting, authToken) {
            return setDefaultFeedSorting(client.baseURL, username, defaultSorting, authToken);
        },
        /**
         * Add the specified channel to the list of channel's the feed will aggregate into a the given user's feed.
         */
        async subscribeFeedToChannel(username, channelname, authToken) {
            return subscribeFeedToChannel(client.baseURL, username, channelname, authToken);
        },
        /**
         * Removes the specified channel to the list of channel's the feed will aggregate into a the given user's feed.
         */
        async unsubscribeFeedFromChannel(username, channelname, authToken) {
            return unsubscribeFeedFromChannel(client.baseURL, username, channelname, authToken);
        },
    };
    return client;
}

/**
 * Returns the sorting setting for the feed of the given user.
 * @async
 * @param {string} baseURL
 * @param {string} username
 * @param {string} authToken
 * @returns {Promise<Feed>} - feed sorting setting
 */
async function getFeed(baseURL, username, authToken) {
    let response = (await makeRequest(
        `${baseURL}/users/${username}/feed`,
        {headers: attachAuthTokenToHeader(authToken)}));
    return response.data;
}

/**
 * Get posts from the user's feed sorted and paginated according to the given parameters.
 * @param {string} baseURL
 * @param {string} username
 * @param {string} authToken
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sorting=""] - either 'hot', 'new' or 'top'. Give an empty string to use the user's default
 * sorting.
 * @param {boolean} [requestConfig.onlyIds=false] - return only the id's of the posts instead of full post object
 * @returns {Promise<Array<Post>>}
 */
async function getFeedPosts(baseURL, username, authToken,
                            {limit, offset, sorting = "", onlyIds = false} = {}
) {
    let response = await makeRequest(
        `${baseURL}/users/${username}/feed/posts`,
        {
            headers: attachAuthTokenToHeader(authToken),
            params: generateQueryParams({limit, offset, sortParameter:sorting, onlyIds}),
        });
    return response.data;
}

/**
 * Returns a list of channels from the given's user feed sorted according
 * to the the passed parameters.
 * @param {string} baseURL
 * @param {string} username
 * @param {string} authToken
 * @param {Object} [config]
 * @param {number} [config.limit=25]
 * @param {number} [config.offset=0]
 * @param {string} [config.sortingOrder=asc] - either 'asc' or 'dsc'
 * @param {string} [config.sortParameter=username] - either 'username', 'name' or 'sub-time'
 * @return {Promise<Object>}
 */
async function getFeedSubscriptions(baseURL, username, authToken,
                                    {limit, offset, sortingOrder, sortParameter} = {}) {

    let response = await makeRequest(
        `${baseURL}/users/${username}/feed/channels`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken),
            params: generateQueryParams({limit, offset, sortingOrder, sortParameter}),
        });
    return response.data;
}

/**
 * Add the specified channel to the list of channel's the feed will aggregate into a the given user's feed.
 * @param baseURL
 * @param username
 * @param channelname - channel username
 * @param authToken
 * @return {Promise<{status: string}>}
 */
async function subscribeFeedToChannel(baseURL, username, channelname, authToken) {
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

/**
 * Sets the default sorting method for the feed of the given user.
 * @param {string} baseURL
 * @param {string} username
 * @param {string} defaultSorting - either 'hot', 'new' or 'top'.
 * @param {string} authToken
 * @return {Promise<{status: string}>}
 */
async function setDefaultFeedSorting(baseURL, username, defaultSorting, authToken) {
    return await makeRequest(
        `${baseURL}/users/${username}/feed`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
            data: {
                defaultSorting,
            }
        });
}


/**
 * Removes the specified channel to the list of channel's the feed will aggregate into a the given user's feed.
 * @param baseURL
 * @param username
 * @param channelname - channel username
 * @param authToken
 * @return {Promise<{status: string}>}
 */
async function unsubscribeFeedFromChannel(baseURL, username, channelname, authToken) {
    return await makeRequest(
        `${baseURL}/users/${username}/feed/channels/${channelname}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken),
        });
}