'use strict';

import {NewUserServiceClient} from './user';
import {NewAuthServiceClient} from './auth';
import {NewPostServiceClient} from './post';
import {NewFeedServiceClient} from './feed';
import {NewChannelServiceClient} from "./channel";

export { NewIssue1Client };
export * from './auth';
export * from './user';
export * from './feed';
export * from './post';

function NewIssue1Client(baseURL) {
    return {
        baseURL,
        authService: NewAuthServiceClient(baseURL),
        userService: NewUserServiceClient(baseURL),
        postService: NewPostServiceClient(baseURL),
        feedService: NewFeedServiceClient(baseURL),
        channelService: NewChannelServiceClient(baseURL),
    };
}

