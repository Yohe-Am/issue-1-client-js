import {generateQueryParams, makeRequest} from "./utilites";

/**
 * @typedef {object} SearchResults - describes results from  the search service
 * @property {Array<Post>} posts
 * @property {Array<Release>} releases
 * @property {Array<Comment>} comments
 * @property {Array<Channel>} channels
 * @property {Array<User>} users
 */

export {searchIssue1, NewSearchServiceClient};

function NewSearchServiceClient(baseURL) {
    const client = {
        baseURL,
        /**
         * Search the breadth of Issue#1 for items that match the specified pattern.
         */
        async searchIssue1(pattern, {limit, offset, sortingOrder, sortParameter} = {}) {
            return searchIssue1(client.baseURL, pattern, {limit, offset, sortingOrder, sortParameter})
        }
    };
    return client;
}

/**
 * Search the breadth of Issue#1 for items that match the specified pattern.
 * @param {string} baseURL
 * @param {string} pattern
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - 'creation_time' or 'rank'
 * @return {Promise<Array<Channel>>}
 */
async function searchIssue1(baseURL, pattern,
                            {limit, offset, sortingOrder, sortParameter} = {}) {

    let response = await makeRequest(
        `${baseURL}/search`,
        {
            method: 'get',
            params: generateQueryParams({pattern, limit, offset, sortingOrder, sortParameter}),
        });
    return response.data;
}
