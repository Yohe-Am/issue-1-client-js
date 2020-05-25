'use strict';

import { makeRequest, attachAuthTokenToHeader } from "./utilites.js";
export { getPost, NewPostServiceClient };

function NewPostServiceClient(baseURL) {
	var client = {
		baseURL,
		async getPost(id) {
			return getPost(client.baseURL, id);
		},
	};
	return client;
}

async function getPost(baseURL, id) {
	return (await makeRequest(
		`${baseURL}/posts/${id}`))
		.data;
}