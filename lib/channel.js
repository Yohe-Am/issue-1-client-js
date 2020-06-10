import {attachAuthTokenToHeader, makeRequest} from "./utilites.js";
import {generateQueryParams} from "./utilites";

export {
    addChannel,
    getChannel,
    searchChannels,
    getChannels,
    updateChannel,
    deleteChannel,
    addAdminToChannel,
    removeAdminFromChannel,
    changeChannelOwner,
    addReleaseToChannelOfficialCatalog,
    removeReleaseFromChannelOfficialCatalog,
    removeReleaseFromChannelCatalog,
    stickyPost,
    removeStickiedPost,
    getChannelPosts,
    getChannelPost,
    getCatalog,
    getOfficialCatalog,
    getReleaseFromOfficialCatalog,
    getReleaseFromCatalog,
    getStickiedPosts,
    getOwner,
    getAdmins,
    NewChannelServiceClient
};

/**
 * @typedef {object} Channel - an object that describes an issue-1 channel type.
 * @property {string} channelUsername
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [ownerUsername]
 * @property {Array<string>} [adminUsernames]
 * @property {Array<number>} [postIDs]
 * @property {Array<number>} [stickiedPostIDs]
 * @property {Array<number>} [releaseIDs]
 * @property {Array<number>} [officialReleaseIDs]
 * @property {string} [creationTime]
 * @property {string} [pictureURL]
 *
 */

function NewChannelServiceClient(baseURL) {
    let client = {
        baseURL,
        /**
         * Create a new channel.
         */
        async addChannel(baseURL, channel, authToken) {
            return addChannel(client.baseURL, channel, authToken);
        },
        /**
         *Returns the channel under the given channelUsername.
         */
        async getChannel(baseURL, channelUsername, authToken = "") {
            return getChannel(client.baseURL, channelUsername, authToken);
        },
        /**
         * Search for channels according to the specified pattern.
         */
        async searchChannels(pattern = "", {limit, offset, sortingOrder, sortParameter} = {}) {
            return searchChannels(client.baseURL, pattern, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Get all channels using the specified pagination.
         */
        async getChannels({limit, offset, sortingOrder, sortParameter} = {}) {
            return getChannels(client.baseURL, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Update the channel under the given username according to the values on the given object.
         */
        async updateUser(channelUsername, channel, authToken) {
            return updateChannel(client.baseURL, channelUsername, channel, authToken);
        },
        /**
         * Sends a a request to remove the channel under the given username.
         */
        async deleteChannel(channelUsername, authToken) {
            return deleteChannel(client.baseURL, channelUsername, authToken);
        },
        /**
         * Adds the given user to the channel's admin list.
         */
        async addAdminToChannel(channelUsername, adminUsername, authToken) {
            return addAdminToChannel(client.baseURL, channelUsername, adminUsername, authToken);
        },
        /**
         * Removes the given user to the channel's admin list.
         */
        async removeAdminFromChannel(channelUsername, adminUsername, authToken) {
            return removeAdminFromChannel(client.baseURL, channelUsername, adminUsername, authToken);
        },
        /**
         * Changes a channel's owner.
         */
        async changeChannelOwner(channelUsername, newOwner, authToken) {
            return changeChannelOwner(client.baseURL, channelUsername, newOwner, authToken);
        },
        /**
         * Remove the given release from the channel's catalog.
         */
        async removeReleaseFromChannelCatalog(channelUsername, releaseID, authToken) {
            return removeReleaseFromChannelCatalog(client.baseURL, channelUsername, releaseID, authToken);
        },
        /**
         * Add a release to the channel's official catalog.
         */
        async addReleaseToChannelOfficialCatalog(channelUsername, releaseID, originPostID, authToken) {
            return addReleaseToChannelOfficialCatalog(client.baseURL, channelUsername, releaseID, originPostID, authToken);
        },
        /**
         * Remove the given release from the channel's official catalog.
         */
        async removeReleaseFromChannelOfficialCatalog(channelUsername, releaseID, authToken) {
            return removeReleaseFromChannelOfficialCatalog(client.baseURL, channelUsername, releaseID, authToken);
        },
        /**
         * Sticky a post.
         */
        async stickyPost(channelUsername, postID, authToken) {
            return stickyPost(client.baseURL, channelUsername, postID, authToken);
        },
        /**
         * Un-sticky a post.
         */
        async removeStickiedPost(channelUsername, postID, authToken) {
            return removeStickiedPost(client.baseURL, channelUsername, postID, authToken);
        },
        /**
         * Get posts from the channel sorted and paginated according to the given parameters.
         * Pagination is not yet implemented for this route. Sorry.
         */
        async getChannelPosts(channelUsername, {limit, offset, sorting, onlyIds = false} = {}) {
            return getChannelPosts(client.baseURL, channelUsername, {limit, offset, sorting, onlyIds});
        },
        /**
         * Get the post under the given id from the channel.
         */
        async getChannelPost(channelUsername, postID) {
            return getChannelPost(client.baseURL, channelUsername, postID);
        },
        /**
         * Get's the full release catalog of a channel. Authorization required.
         * Pagination is not yet implemented for this route. Sorry.
         */
        async getCatalog(channelUsername, authToken, {limit, offset, sorting, onlyIds = false} = {}) {
            return getCatalog(client.baseURL, channelUsername, authToken, {limit, offset, sorting, onlyIds});
        },
        /**
         * Get's the official release catalog of a channel.
         * Pagination is not yet implemented for this route. Sorry.
         */
        async getOfficialCatalog(channelUsername, {limit, offset, sorting, onlyIds = false} = {}) {
            return getOfficialCatalog(client.baseURL, channelUsername, {limit, offset, sorting, onlyIds});
        },
        /**
         * Fetches the specified release from the channel catalog.
         */
        async getReleaseFromCatalog(channelUsername, releaseID, authToken) {
            return getReleaseFromCatalog(client.baseURL, channelUsername, releaseID, authToken);
        },
        /**
         * Fetches the specified release from the channel official catalog.
         */
        async getReleaseFromOfficialCatalog(channelUsername, releaseID) {
            return getReleaseFromOfficialCatalog(client.baseURL, channelUsername, releaseID);
        },
        /**
         * Fetches the stickied posts of the channel.
         */
        async getStickiedPosts(channelUsername) {
            return getStickiedPosts(client.baseURL, channelUsername);
        },
        /**
         * Get the admins of a channel. Authorization required.
         */
        async getAdmins(channelUsername, authToken) {
            return getAdmins(client.baseURL, channelUsername, authToken);
        },
        /**
         * Get the owner of a channel. Authorization required.
         */
        async getOwner(channelUsername, authToken) {
            return getOwner(client.baseURL, channelUsername, authToken);
        },
    };
    return client;
}

/**
 * Create a new channel.
 * @param {string} baseURL
 * @param {Channel} channel - owner username should match with the owner of the authToken
 * @param {string} authToken
 * @return {Promise<Channel>}
 */
async function addChannel(baseURL, channel, authToken) {
    return (await makeRequest(
        `${baseURL}/channels`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: channel,
        }))
        .data;
}

/**
 * Returns the channel under the given channelUsername.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} [authToken] - if provided and if it's the token of a channel admin,
 * private channel info will also be returned.
 * @return {Promise<Channel>}
 */
async function getChannel(baseURL, channelUsername, authToken = "") {
    let response = (await makeRequest(
        `${baseURL}/channels/${channelUsername}`,
        {
            headers: attachAuthTokenToHeader(authToken)
        }));
    return response.data;
}

/**
 * Search for channels according to the specified pattern.
 * @param {string} baseURL
 * @param {string} pattern
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'channelUsername' or 'name'
 * @return {Promise<Array<Channel>>}
 */
async function searchChannels(baseURL, pattern = "",
                              {limit, offset, sortingOrder, sortParameter} = {}) {
    let response = await makeRequest(
        `${baseURL}/channels`,
        {
            method: 'get',
            params: generateQueryParams({pattern, limit, offset, sortingOrder, sortParameter}),
        });
    return response.data;
}

/**
 * Get all channels the specified pagination.
 * @param {string} baseURL
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'username', 'first-name' or 'last-name'
 * @returns {Promise<Array<Channel>>}
 */
async function getChannels(baseURL, {limit, offset, sortingOrder, sortParameter} = {}) {
    return searchChannels(baseURL, "", {limit, offset, sortingOrder, sortParameter})
}

/**
 * Update the channel under the given username according to the values on the given object.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {Channel} channel - new values to be updated
 * @param {string} authToken - must belong to an admin
 * @returns {Promise<Channel>}
 */
async function updateChannel(baseURL, channelUsername, channel, authToken) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
            data: channel
        }))
        .data;
}

/**
 * Sends a a request to remove the channel under the given username.
 * @async
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function deleteChannel(baseURL, channelUsername, authToken) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken)
        }));
}

/**
 * Adds the given user to the channel's admin list.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} adminUsername - the new admin
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function addAdminToChannel(baseURL, channelUsername, adminUsername, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/admins/${adminUsername}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Remove the given user from the channel's admin list.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} adminUsername - the outgoing admin
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function removeAdminFromChannel(baseURL, channelUsername, adminUsername, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/admins/${adminUsername}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Changes a channel's owner.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} newOwner - the new owner
 * @param {string} authToken - must belong to previous owner
 * @return {Promise<{status: string}>}
 */
async function changeChannelOwner(baseURL, channelUsername, newOwner, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/owners/${newOwner}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Remove the given release from the channel's catalog.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} releaseID - the outgoing release
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function removeReleaseFromChannelCatalog(baseURL, channelUsername, releaseID, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/catalogs/${releaseID}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Add a release to the channel's official catalog.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} releaseID - the release
 * @param {number} originPostID - the post from which the release is from
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function addReleaseToChannelOfficialCatalog(baseURL, channelUsername, releaseID, originPostID, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/official/${releaseID}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
            data: {postID: originPostID}
        });
}

/**
 * Remove the given release from the channel's official catalog.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} releaseID - the outgoing release
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function removeReleaseFromChannelOfficialCatalog(baseURL, channelUsername, releaseID, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/official/${releaseID}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Sticky a post.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} postID - the post
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function stickyPost(baseURL, channelUsername, postID, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/stickiedPosts/${postID}`,
        {
            method: 'put',
            headers: attachAuthTokenToHeader(authToken),
        });
}

/**
 * Un-sticky a post.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} postID - the post
 * @param {string} authToken - must belong to an admin
 * @return {Promise<{status: string}>}
 */
async function removeStickiedPost(baseURL, channelUsername, postID, authToken) {
    return await makeRequest(
        `${baseURL}/channels/${channelUsername}/stickiedPosts/${postID}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken),
        });
}


/**
 * Get posts from the channel sorted and paginated according to the given parameters.
 * Pagination is not yet implemented for this route. Sorry.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25] - not yet implemented.
 * @param {Number} [requestConfig.offset=0] - not yet implemented.
 * @param {string} [requestConfig.sorting=""] - not yet implemented.
 * @param {boolean} [requestConfig.onlyIds=false] - not yet implemented
 * @returns {Promise<Array<Post>>}
 */
async function getChannelPosts(baseURL, channelUsername,
                               {limit, offset, sorting = "", onlyIds = false} = {}
) {
    let response = await makeRequest(
        `${baseURL}/channels/${channelUsername}/Posts`,
        {
            params: generateQueryParams({limit, offset, sortParameter:sorting, onlyIds}),
        });
    return response.data;
}

/**
 * Get the post under the given id from the channel
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} postID - the post
 * @return {Promise<Post>}
 */
async function getChannelPost(baseURL, channelUsername, postID) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/Posts/${postID}`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Get's the full release catalog of a channel. Authorization required.
 * Pagination is not yet implemented for this route. Sorry.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} authToken - must belong to an admin
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25] - not yet implemented.
 * @param {Number} [requestConfig.offset=0] - not yet implemented.
 * @param {string} [requestConfig.sorting=""] - not yet implemented.
 * @param {boolean} [requestConfig.onlyIds=false] - not yet implemented
 * @returns {Promise<Array<Release>>}
 */
async function getCatalog(baseURL, channelUsername, authToken,
                          {limit, offset, sorting = "", onlyIds = false} = {}
) {
    let response = await makeRequest(
        `${baseURL}/channels/${channelUsername}/catalog`,
        {
            headers: attachAuthTokenToHeader(authToken),
            params: generateQueryParams({limit, offset, sortParameter:sorting, onlyIds}),
        });
    return response.data;
}


/**
 * Get's the official release catalog of a channel.
 * Pagination is not yet implemented for this route. Sorry.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25] - not yet implemented.
 * @param {Number} [requestConfig.offset=0] - not yet implemented.
 * @param {string} [requestConfig.sorting=""] - not yet implemented.
 * @param {boolean} [requestConfig.onlyIds=false] - not yet implemented
 * @returns {Promise<Array<Release>>}
 */
async function getOfficialCatalog(baseURL, channelUsername,
                                  {limit, offset, sorting = "", onlyIds = false} = {}
) {
    let response = await makeRequest(
        `${baseURL}/channels/${channelUsername}/official`,
        {
            params: generateQueryParams({limit, offset, sortParameter:sorting, onlyIds}),
        });
    return response.data;
}

/**
 * Fetches the specified release from the channel catalog. Authorization required.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} authToken - must belong to an admin
 * @param {number} releaseID - the post
 * @return {Promise<Release>}
 */
async function getReleaseFromCatalog(baseURL, channelUsername, releaseID, authToken) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/catalogs/${releaseID}`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken),
        }))
        .data;
}

/**
 * Fetches the specified release from the channel official catalog.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {number} releaseID - the post
 * @return {Promise<Release>}
 */
async function getReleaseFromOfficialCatalog(baseURL, channelUsername, releaseID) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/catalogs/${releaseID}`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Fetches the stickied posts of the channel..
 * @param {string} baseURL
 * @param {string} channelUsername
 * @return {Promise<Post>}
 */
async function getStickiedPosts(baseURL, channelUsername) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/stickiedPosts`,
        {
            method: 'get',
        }))
        .data;
}

/**
 * Get the admins of a channel. Authorization required.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} authToken
 * @return {Promise<Array<string>>} - array of usernames
 */
async function getAdmins(baseURL, channelUsername, authToken) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/admins`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken),
        }))
        .data;
}

/**
 * Get the owner of a channel. Authorization required.
 * @param {string} baseURL
 * @param {string} channelUsername
 * @param {string} authToken
 * @return {Promise<string>} - username
 */
async function getOwner(baseURL, channelUsername, authToken) {
    return (await makeRequest(
        `${baseURL}/channels/${channelUsername}/owners`,
        {
            method: 'get',
            headers: attachAuthTokenToHeader(authToken),
        }))
        .data;
}