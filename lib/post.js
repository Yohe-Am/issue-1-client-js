'use strict';

import {attachAuthTokenToHeader, makeRequest} from "./utilites.js";

export {
    getPost,
    getPosts,
    searchPosts,
    addPost,
    deletePost,
    updatePost,
    getPostComments,
    getPostReleases,
    getPostStars,
    getPostStarOfUser,
	starPost,
    NewPostServiceClient
};

/**
 * @typedef {object} Post - an object that describes an issue-1 post type.
 * @property {number} id
 * @property {string} [postedByUsername]
 * @property {string} [originChannel]
 * @property {string} [title]
 * @property {string} [description]
 * @property {Array<number>} [contentsID]
 * @property {Object} [stars]
 * @property {Array<number>} [creationTime]
 * @property {string} [creationTime]
 */


function NewPostServiceClient(baseURL) {
    let client = {
        baseURL,
        /**
         * Returns the post under the given id.
         */
        async getPost(id) {
            return getPost(client.baseURL, id);
        },
        /**
         * Search for posts according to the specified pattern.
         */
        async searchPosts(pattern = "", {limit, offset, sortingOrder, sortParameter} = {}) {
            return searchPosts(client.baseURL, pattern, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Get all posts using the specified pagination.
         */
        async getPosts({limit, offset, sortingOrder, sortParameter} = {}) {
            return getPosts(client.baseURL, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Create a new post.
         */
        async addPost(post, authToken) {
            return addPost(client.baseURL, post, authToken);
        },
        /**
         * Sends a a request to remove the post under the given id.
         */
        async deletePost(id, authToken) {
            return deletePost(client.baseURL, id, authToken);
        },
        /**
         * Sends a a request to remove the post under the given id.
         */
        async updatePost(id, post, authToken) {
            return updatePost(client.baseURL, id, post, authToken);
        },
        /**
         * Get the comments for the post under the given id.
         */
        async getPostComments(id) {
            return getPostComments(client.baseURL, id);
        },
        /**
         * Get the releases for the post under the given id.
         */
        async getPostReleases(id) {
            return getPostReleases(client.baseURL, id);
        },
        /**
         * Get the star information for the post under the given id.
         */
        async getPostStars(id) {
            return getPostStars(client.baseURL, id);
        },
        /**
         * Get the star information for the post under the given id for the specified user.
         */
        async getPostStarOfUser(id, username) {
            return getPostStarOfUser(client.baseURL, id, username);
        },
        /**
         * Modifies the star information for the post under the given id for the specified user.
         */
		async starPost(id, starCount,username, authToken) {
            return starPost(client.baseURL, id, starCount,username, authToken);
        },
    };
    return client;
}

/**
 * Returns the post under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @return {Promise<Post>}
 */
async function getPost(baseURL, id) {
    return (await makeRequest(
        `${baseURL}/posts/${id}`))
        .data;
}

/**
 * Search for posts according to the specified pattern.
 * @param {string} baseURL
 * @param {string} pattern
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'channel_from', 'posted_by' or 'title'
 * @return {Promise<Array<Post>>}
 */
async function searchPosts(baseURL, pattern = "",
                           {limit, offset, sortingOrder, sortParameter} = {}) {
    let params = {};
    if (limit || offset) {
        params = {
            limit,
            offset,
            ...params,
        }
    }
    if (sortingOrder) {
        params.sort = `${sortParameter}`;
        if (sortParameter) {
            params.sort += `_${sortingOrder}`;
        }
    }
    if (pattern) {
        params.pattern = pattern;
    }
    let response = await makeRequest(
        `${baseURL}/posts`,
        {
            method: 'get',
            params,
        });
    return response.data;
}

/**
 * Get all posts using the specified pagination.
 * @param {string} baseURL
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'username', 'first-name' or 'last-name'
 * @returns {Promise<Array<Post>>}
 */
async function getPosts(baseURL, {limit, offset, sortingOrder, sortParameter} = {}) {
    return searchPosts(baseURL, "", {limit, offset, sortingOrder, sortParameter})
}

/**
 * Create a new post.
 * @param {string} baseURL
 * @param {Post} post
 * @param {string} authToken - must belong to an admin of the channel given under post.originChannel
 * @return {Promise<Post>}
 */
async function addPost(baseURL, post, authToken) {
    return (await makeRequest(
        `${baseURL}/posts`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: post,
        }))
        .data;
}


/**
 * Sends a a request to remove the post under the given id.
 * @async
 * @param {string} baseURL
 * @param {number} id
 * @param {string} authToken - must belong to an admin of the post's channel
 * @return {Promise<{status: string}>}
 */
async function deletePost(baseURL, id, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${id}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken)
        }));
}

/**
 * Update the post under the given id according to the values on the given object.
 * @param {string} baseURL
 * @param {number} id
 * @param {Post} post - new values to be updated
 * @param {string} authToken - must belong to an admin
 * @returns {Promise<Post>}
 */
async function updatePost(baseURL, id, post, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${id}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
            data: post
        }))
        .data;
}

/**
 * Get the comments for the post under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @returns {Promise<Array<Comment>>}
 */
async function getPostComments(baseURL, id) {
    return (await makeRequest(
        `${baseURL}/posts/${id}/comments`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Get the releases for the post under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @returns {Promise<Array<Release>>}
 */
async function getPostReleases(baseURL, id) {
    return (await makeRequest(
        `${baseURL}/posts/${id}/releases`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Get the star information for the post under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @returns {Promise<Array<{username: string, stars: number}>>}
 */
async function getPostStars(baseURL, id) {
    return (await makeRequest(
        `${baseURL}/posts/${id}/stars`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Get the star information for the post under the given id for
 * the specified user.
 * @param {string} baseURL
 * @param {number} id
 * @param {string} username
 * @returns {Promise<{username: string, stars: number}>}
 */
async function getPostStarOfUser(baseURL, id, username) {
    return (await makeRequest(
        `${baseURL}/posts/${id}/stars/${username}`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Modifies the star information for the post under the given id for
 * the specified user.
 * @param {string} baseURL
 * @param {number} id
 * @param {number} starCount - maximum of 5 stars per user
 * @param {string} username - user which star count has to be updated to
 * @param {string} authToken - must belong to the holder of the username
 * @returns {Promise<{username: string, stars: number}>}
 */
async function starPost(baseURL, id, starCount, username, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${id}/stars`,
        {
            method: 'put',
			headers: attachAuthTokenToHeader(authToken),
			data:{
            	username: username,
				stars: starCount,
			},
        }))
        .data;
}
