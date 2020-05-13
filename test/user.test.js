'use strict';

import assert from 'assert';
import { addUser, getUser, NewUserServiceClient } from '../lib/user.js';

const baseURL = "http://localhost:8080";

const testUser = {
    username: 'Cobotbol',
    email: "paper.bug@hot.ping",
    firstName: 'Jeff',
    lastName: 'Poisonne',
    password: 'password'
};

var userServiceClient = NewUserServiceClient(baseURL);

(async function testModule() {
    try {
        // await testAsyncFn(addUser, baseURL, testUser);
        await testAsyncFn(getUser, baseURL, testUser.username);
        console.log("tests passed");
    } catch (err) {
        console.log("tests failed");
    }
})();


async function testAsyncFn(fn, ...args) {
    try {
        var result = await fn.apply(null, args);
        console.log(result);
    }
    catch{
        console.log(error);
        throw error;
    }
}


/* User struct {
    Username     string    `json:"username"`
    Email        string    `json:"email"`
    FirstName    string    `json:"firstName"`
    MiddleName   string    `json:"middleName"`
    LastName     string    `json:"lastName"`
    CreationTime time.Time `json:"creationTime"`
    Bio          string    `json:"bio"`
    //BookmarkedPosts map[time.Time]Post `json:"bookmarkedPosts"`
    Password   string `json:"password,omitempty"`
    PictureURL string `json:"pictureURL"`
}
 */