'use strict';

import { NewUserServiceClient } from './user';
import { NewAuthServiceClient } from './auth';

export { NewIssue1Client };

function NewIssue1Client(baseURL) {
    var client = {
        baseURL,
        userService: NewUserServiceClient(baseURL),
        authService: NewAuthServiceClient(baseURL),
    };
    return client;
}

