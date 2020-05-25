'use strict';

import { NewUserServiceClient } from './user';
import { NewAuthServiceClient } from './auth';
import { NewPostServiceClient } from './post';
import { NewFeedServiceClient } from './feed';

export { NewIssue1Client };
export * from './auth';
export * from './user';
export * from './feed';
export * from './post';

function NewIssue1Client(baseURL) {
    var client = {
        baseURL,
        authService: NewAuthServiceClient(baseURL),
        userService: NewUserServiceClient(baseURL),
        postService: NewPostServiceClient(baseURL),
        feedService: NewFeedServiceClient(baseURL),
    };
    return client;
}

