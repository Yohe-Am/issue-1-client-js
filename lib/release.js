import {
    attachAuthTokenToHeader, attachImageToRequest,
    generateQueryParams,
    makeRequest
} from "./utilites";

export {
    getRelease,
    searchReleases,
    getReleases,
    updateRelease,
    deleteRelease,
    NewReleaseServiceClient,
    addTextRelease,
    updateImageRelease,
    addImageRelease,
};

/**
 * @typedef {object} Release
 * Represents an atomic work of creativity.
 *
 * @property {number} id
 * @property {string} ownerChannel
 * @property {string} type - either 'image' or 'text'
 * @property {string} content
 * @property {Metadata} [metadata]
 * @property {string} creationTime
 */


/**
 * @typedef {object} Metadata
 * An object that holds meta information for {@link Release}s.
 *
 * @property {string} [title]
 * @property {Date} [releaseDate]
 * @property {string} [genreDefining] -the genre classification that defines the release most.
 * @property {string} [description] - for metadata like blurbs.
 * @property {ExtraMetadata} [other] - other metadata
 */


/**
 * @typedef {object} ExtraMetadata
 * Extra meta information.
 * @see {@link Metadata}
 *
 * @property {Array<string>} [authors] - contains username in string form if author is an issue#1 user or plain names otherwise.
 * @property {Array<string>} [genres]
 */

function NewReleaseServiceClient(baseURL) {
    let client = {
        baseURL,
        /**
         * Returns the release under the given id.
         */
        async getRelease(id, authToken = "") {
            return getRelease(client.baseURL, id, authToken);
        },
        /**
         * Create a new text release.
         */
        async addTextRelease(release, authToken) {
            return addTextRelease(client.baseURL, release, authToken);
        },
        /**
         * Create a new image release.
         */
        async addImageRelease(release, authToken, imageData, imageName = 'client-js.jpg') {
            return addImageRelease(client.baseURL, release, authToken, imageData, imageName);
        },
        /**
         * Search for releases according to the specified pattern.
         */
        async searchReleases(pattern = "", {limit, offset, sortingOrder, sortParameter} = {}) {
            return searchReleases(client.baseURL, pattern, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Get all releases using the specified pagination.
         */
        async getReleases({limit, offset, sortingOrder, sortParameter} = {}) {
            return getReleases(client.baseURL, {limit, offset, sortingOrder, sortParameter});
        },
        /**
         * Update the release under the given id according to the values on the given object.
         */
        async updateRelease(id, release, authToken) {
            return updateRelease(client.baseURL, id, release, authToken);
        },
        /**
         * Update an image release under the given id according to the values on the given object while also replacing it's image using the provided data.
         */
        async updateImageRelease(id, release, authToken, imageData, imageName = 'client-js.jpg') {
            return updateImageRelease(client.baseURL, id, release, authToken, imageData, imageName);
        },
        /**
         * Sends a a request to remove the release under the given id.
         */
        async deleteRelease(id, authToken) {
            return deleteRelease(client.baseURL, id, authToken);
        },
    };
    return client;
}

/**
 * Returns the release under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @param {string} [authToken] - if provided and if it's the token of a channel admin,
 * allows access to unofficial releases of said channel.
 * @return {Promise<Release>}
 */
async function getRelease(baseURL, id, authToken = "") {
    let response = (await makeRequest(
        `${baseURL}/releases/${id}`,
        {
            headers: attachAuthTokenToHeader(authToken)
        }));
    return response.data;
}

/**
 * Create a new text release.
 * @param {string} baseURL
 * @param {Release} release
 * @param {string} authToken - must belong to an admin of the channel given under release.originChannel
 * @return {Promise<Release>}
 */
async function addTextRelease(baseURL, release, authToken) {
    release.type = 'text';
    return (await makeRequest(
        `${baseURL}/releases`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: release,
        }))
        .data;
}

/**
 * Create a new image release.
 * @param {string} baseURL
 * @param {Release} release
 * @param {string} authToken - must belong to an admin of the channel given under release.originChannel
 * @param {Blob | FormData | Buffer | Readable} imageData
 * @param {string} imageName - name under which the image will be saved on the server
 * @return {Promise<Release>}
 */
async function addImageRelease(baseURL, release, authToken,
                               imageData, imageName = 'client-js.jpg') {
    release.type = 'image';
    return (await makeRequest(
        `${baseURL}/releases`,
        {
            method: 'post',
            ...await attachImageToRequest(
                imageData,
                {
                    otherData: release,
                    headers: attachAuthTokenToHeader(authToken),
                    imageName
                }
            ),
        }))
        .data;
}

/**
 * Search for releases according to the specified pattern.
 * @param {string} baseURL
 * @param {string} pattern
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'channel_from', 'posted_by' or 'title'
 * @return {Promise<Array<Release>>}
 */
async function searchReleases(baseURL, pattern = "",
                              {limit, offset, sortingOrder, sortParameter} = {}) {

    let response = await makeRequest(
        `${baseURL}/releases`,
        {
            method: 'get',
            params: generateQueryParams({pattern, limit, offset, sortingOrder, sortParameter}),
        });
    return response.data;
}

/**
 * Get all releases using the specified pagination.
 * @param {string} baseURL
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time', 'channel', or 'type'
 * @returns {Promise<Array<Release>>}
 */
async function getReleases(baseURL, {limit, offset, sortingOrder, sortParameter} = {}) {
    return searchReleases(baseURL, "", {limit, offset, sortingOrder, sortParameter})
}


/**
 * Update the release under the given id according to the values on the given object.
 * @param {string} baseURL
 * @param {number} id
 * @param {Release} release - new values to be updated
 * @param {string} authToken - must belong to an admin
 * @returns {Promise<Release>}
 */
async function updateRelease(baseURL, id, release, authToken) {
    return (await makeRequest(
        `${baseURL}/releases/${id}`,
        {
            method: 'patch',
            headers: attachAuthTokenToHeader(authToken),
            data: release
        }))
        .data;
}

/**
 * Update an image release under the given id according to the values on the given object
 * while also replacing it's image using the provided data.
 * @param {string} baseURL
 * @param {number} id
 * @param {Release} release
 * @param {string} authToken - must belong to an admin of the channel given under release.originChannel
 * @param {Blob | FormData | Buffer | Readable} imageData
 * @param {string} imageName - name under which the image will be saved on the server
 * @return {Promise<Release>}
 */
async function updateImageRelease(baseURL, id, release, authToken,
                                  imageData, imageName = 'client-js.jpg') {
    release.type = 'image';
    return (await makeRequest(
        `${baseURL}/releases/${id}`,
        {
            method: 'patch',
            ...await attachImageToRequest(
                imageData,
                {
                    otherData: release,
                    headers: attachAuthTokenToHeader(authToken),
                    imageName
                }
            ),
        }))
        .data;
}


/**
 * Sends a a request to remove the release under the given id.
 *
 * @param {string} baseURL
 * @param {number} id
 * @param {string} authToken - must belong to an admin of the releases's channel
 * @return {Promise<{status: string}>}
 */
async function deleteRelease(baseURL, id, authToken) {
    return (await makeRequest(
        `${baseURL}/releases/${id}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken)
        }));
}

// TODO: update image release