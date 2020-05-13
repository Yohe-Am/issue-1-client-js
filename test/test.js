'use strict';

import assert from 'assert';

function testAsyncFn(fn) {
    fn()
        .then(
            () => console.log("tests passed")
        ).catch(
            (err) => {
                console.log(`tests failed: --- --- ---`);
                console.log(err);
            }
        );
}

async function testFruitfulAsyncFn(fn, ...args) {
    try {
        var result = await fn.apply(null, args);
        console.log(`test passed: +++ +++ +++ `);
        console.log(result);
    }
    catch (err) {
        console.log(`tests failed: --- --- ---`);
        console.log(err);
        throw new Error(`Fruitful fn failed: ${fn.name}`);
    }
}

const baseURL = "http://localhost:8080";

const testUser = {
    username: 'Cobotbol',
    email: "paper.bug@hot.ping",
    firstName: 'Jeff',
    lastName: 'Poisonne',
    password: 'password'
};

import { addUser, getUser, NewUserServiceClient } from '../lib/user.js';
import { getAuthToken } from '../lib/auth.js';

async function testUserServiceClientModule() {
    /*  
    {  // add user
         await testAsyncFn(addUser, baseURL, testUser);
     }
     
     { // getUser - nonauthorized
 
         await testAsyncFn(getUser, baseURL, testUser.username);
     } 
         

     */
     { // getUser - authorized
        let token = await getAuthToken(baseURL, testUser.username, testUser.password);
        console.log("got token");
        await testFruitfulAsyncFn(getUser, baseURL, testUser.username, token);
    }
}

async function testAuthServiceClientModule() {
    { // getAuthToken
        await testFruitfulAsyncFn(getAuthToken, baseURL, testUser.username, testUser.password);
    }
}


testAsyncFn(testUserServiceClientModule);
// testAsyncFn(testAuthServiceClientModule);


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