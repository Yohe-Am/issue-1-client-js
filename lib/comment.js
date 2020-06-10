import {
    attachAuthTokenToHeader,
    makeRequest
} from "./utilites";

export {
    addComment,
    addReply,
    getComment,
    getComments,
    getReplies,
    updateComment,
    deleteComment,
    NewCommentServiceClient
};


/**
 * @typedef {object} Comment - an object that describes the issue-1 comment type.
 * @property {number} id
 * @property {string} [commenter]
 * @property {number} [originPost]
 * @property {string} [content]
 * @property {number} [replyTo] - commentID of comment being replied to.
 * '-1' if a direct comment on post.
 * @property {string} [creationTime]
 */

function NewCommentServiceClient(baseURL) {
    const client = {
        baseURL,
        /**
         * Create a new comment.
         */
        async addComment(comment, postID, authToken) {
            return addComment(client.baseURL, comment, postID, authToken);
        },
        /**
         * Reply to a comment.
         */
        async addReply(comment, postID, commentID, authToken) {
            return addReply(client.baseURL, comment, postID, commentID, authToken);
        },
        /**
         * Returns the comment under the given id.
         */
        async getComment(id, postID) {
            return getComment(client.baseURL, id, postID);
        },
        /**
         * Get all comments of a post according the specified pagination
         */
        async getComments(postID, {limit, offset, sortingOrder, sortParameter} = {}) {
            return getComments(client.baseURL, postID, {limit, offset, sortingOrder, sortParameter})
        },
        /**
         * Get all replies of a comment according the specified pagination.
         */
        async getReplies(commentID, postID, {limit, offset, sortingOrder, sortParameter} = {}) {
            return getReplies(client.baseURL, commentID, postID, {limit, offset, sortingOrder, sortParameter})
        },
        /**
         * Update the comment under the given id according to the values on the given object.
         */
        async updateComment(id, postID, comment, authToken) {
            return updateComment(client.baseURL, id, postID, comment, authToken)
        },
        /**
         * Sends a a request to remove the comment under the given id.
         */
        async deleteComment(id, postID, authToken) {
            return deleteComment(client.baseURL, id, postID, authToken)
        },
    };
    return client;
}

/**
 * Create a new comment.
 * @param {string} baseURL
 * @param {Comment} comment
 * @param {number} postID
 * @param {string} authToken - must belong to an admin of the channel given under comment.originChannel
 * @return {Promise<Comment>}
 */
async function addComment(baseURL, comment, postID, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${postID}/comments`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: comment,
        }))
        .data;
}

/**
 * Reply to a comment.
 * @param {string} baseURL
 * @param {Comment} comment
 * @param {number} postID
 * @param {number} commentID - comment to which to reply to
 * @param {string} authToken - must belong to an admin of the channel given under comment.originChannel
 * @return {Promise<Comment>}
 */
async function addReply(baseURL, comment, postID, commentID, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${postID}/comments/${commentID}/replies`,
        {
            method: 'post',
            headers: attachAuthTokenToHeader(authToken),
            data: comment,
        }))
        .data;
}

/**
 * Returns the comment under the given id.
 * @param {string} baseURL
 * @param {number} id
 * @param {number} postID - post from
 * @return {Promise<Comment>}
 */
async function getComment(baseURL, id, postID) {
    return (await makeRequest(
        `${baseURL}/posts/${postID}/comments/${id}`))
        .data;
}

/**
 * Get all comments of a post according the specified pagination.
 * @param {string} baseURL
 * @param {number} postID
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - only 'creation_time' for now.
 * @return {Promise<Array<Comment>>}
 */
async function getComments(baseURL, postID,
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
    let response = await makeRequest(
        `${baseURL}/posts/${postID}/comments`,
        {
            method: 'get',
            params,
        });
    return response.data;
}

/**
 * Get all replies of a comment according the specified pagination.
 * @param {string} baseURL
 * @param {number} commentID - comment for which replies are to be fetched for
 * @param {number} postID
 * @param {Object} [requestConfig]
 * @param {Number} [requestConfig.limit=25]
 * @param {Number} [requestConfig.offset=0]
 * @param {string} [requestConfig.sortingOrder] - either 'asc' or 'dsc'
 * @param {string} [requestConfig.sortParameter] - only 'creation_time' for now.
 * @return {Promise<Array<Comment>>}
 */
async function getReplies(baseURL, commentID, postID,
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
    let response = await makeRequest(
        `${baseURL}/posts/${postID}/comments/${commentID}/replies`,
        {
            method: 'get',
            params,
        });
    return response.data;
}

/**
 * Update the comment under the given id according to the values on the given object.
 * @param {string} baseURL
 * @param {number} id
 * @param {number} postID - post to which the comment belongs
 * @param {Comment} comment - new values to be updated
 * @param {string} authToken - must belong to the commenter
 * @returns {Promise<Comment>}
 */
async function updateComment(baseURL, id, postID, comment, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${postID}/comments/${id}`,
        {
            method: 'patch',
            headers: attachAuthTokenToHeader(authToken),
            data: comment
        }))
        .data;
}


/**
 * Sends a a request to remove the comment under the given id.
 * @async
 * @param {string} baseURL
 * @param {number} id
 * @param {number} postID - post the comment's from
 * @param {string} authToken - must belong to the commenter
 * @return {Promise<{status: string}>}
 */
async function deleteComment(baseURL, id, postID, authToken) {
    return (await makeRequest(
        `${baseURL}/posts/${postID}/comments/${id}`,
        {
            method: 'delete',
            headers: attachAuthTokenToHeader(authToken)
        }));
}
