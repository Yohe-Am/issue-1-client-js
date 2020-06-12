'use strict';

import {NewUserServiceClient} from './user';
import {NewAuthServiceClient} from './auth';
import {NewPostServiceClient} from './post';
import {NewFeedServiceClient} from './feed';
import {NewChannelServiceClient} from "./channel";
import {NewCommentServiceClient} from "./comment";
import {NewReleaseServiceClient} from "./release";
import {NewSearchServiceClient} from "./search";

export { NewIssue1Client };
export * from './auth';
export * from './user';
export * from './feed';
export * from './post';
export * from './channel';
export * from './comment';
export * from './search';
export * from './release';

function NewIssue1Client(baseURL) {
    return {
        baseURL,
        authService: NewAuthServiceClient(baseURL),
        userService: NewUserServiceClient(baseURL),
        postService: NewPostServiceClient(baseURL),
        feedService: NewFeedServiceClient(baseURL),
        channelService: NewChannelServiceClient(baseURL),
        commentService: NewCommentServiceClient(baseURL),
        searchService: NewSearchServiceClient(baseURL),
        releaseService: NewReleaseServiceClient(baseURL),
    };
}

