// import 'chai/register-should';
import 'chai/register-expect';

import {
    getAuthToken,
    refreshAuthToken,
    logout
} from '../lib/auth.js';

import {
    addUser,
    getUser,
    getUsers,
    searchUsers,
    deleteUser,
    addPostBookmark,
    updateUser
} from '../lib/user.js';

import {
    getPost
} from "../lib/post.js";

import {
    getFeedPosts,
    subscribeToChannel
} from "../lib/feed.js";
import {beforeAll, describe} from "@jest/globals";
import {addPicture, deleteBookmark, getUserBookmarks} from "../lib/user";
import fs from 'fs';

const baseURL = "http://localhost:8080";

const testUser = {
    username: 'Cobotbol',
    email: "paper.bug@hot.ping",
    firstName: 'Jeff',
    lastName: 'Poisonne',
    password: 'password'
};

let authToken;
async function createAndAddTestUser() {
    // create test user and get authToken
    try {
        await addUser(baseURL, testUser);
    } catch (err) {
        if (!(!!err.data && err.data.errorMessage === "username is occupied")) {
            throw err;
        }
    }
    authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
}

async function deleteTestUser() {
    await deleteUser(baseURL, testUser.username, authToken);
}

beforeAll(async () => {
    await createAndAddTestUser()
});


/* afterAll(async () => {
    deleteTestUser();
}); */

describe('authService', () => {
    'use strict';

    test('getsAuthToken - success', async () => {
        let authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
        expect(authToken).to.be.a('string');
    });

    test('getsAuthToken - wrong password', async () => {
        try {
            await getAuthToken(baseURL, testUser.username, 'wrong-password');
        } catch (error) {
            expect(error).to.have.property('data')
                .that.has.property('errorReason')
                .that.equals('credentials');
        }
    });

    test('refreshAuthToken - success', async () => {
        var authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
        var refreshedToken = await refreshAuthToken(baseURL, authToken);
        expect(refreshedToken).to.be.a('string');
    });

    test('refreshAuthToken - bad token', async () => {
        try {
            var authToken = "badtokenheyoh,let'sgo";
            await refreshAuthToken(baseURL, authToken);
        } catch (error) {
            expect(error).to.have.property('response')
                .that.has.property('status')
                .that.equals(401);
        }
    });

    test('logout - success', async () => {
        var authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
        var response = await logout(baseURL, authToken);
        expect(response).to.have.property("status").that.equals("success");
    });

});

describe('userService', () => {
    'use strict';

    // skip addUser
    test.skip('addUser - success', async () => {
        let user = await getUser(baseURL, testUser);
        expect(user).to.have.property('username', testUser.username);
        expect(user).to.have.property('firstName', testUser.firstName);
        expect(user).to.have.property('lastName', testUser.lastName);
    });

    test('getUser - success', async () => {
        let user = await getUser(baseURL, testUser.username);
        expect(user).to.have.property('username', testUser.username);
        expect(user).to.have.property('firstName', testUser.firstName);
        expect(user).to.have.property('lastName', testUser.lastName);
    });

    test('getUser - authorized - success', async () => {
        let user = await getUser(baseURL, testUser.username, authToken);
        expect(user).to.have.property('username', testUser.username);
        expect(user).to.have.property('firstName', testUser.firstName);
        expect(user).to.have.property('lastName', testUser.lastName);
    });

    test('getUser - unknown username', async () => {
        try {
            await getUser(baseURL, "fake baby");
        } catch (error) {
            expect(error).to.have.property("data")
                .that.has.property("errorReason")
                .that.equals("username");
        }
    });

    // skip deleteUser
    test.skip('deleteUser - success', async () => {
        let response = await deleteUser(baseURL,testUser.username,  authToken);
        expect(response).to.have.property("status").that.equals("success");
    });

    test('getUsers - success', async () => {
        let users = await getUsers(baseURL);
        expect(users).to.be.an('array');
    });

    test('searchUsers - success', async () => {
        let users = await searchUsers(baseURL, "Poisonne");
        expect(users).to.be.an('array');
        expect(users[0]).to.have.property('username', testUser.username);
    });

    test('updateUser - success', async () => {
        let newEmail = "wishes.on.a.wheel@beach.bum";
        let user = await updateUser(baseURL, testUser.username, { email: newEmail}, authToken);
        expect(user).to.have.property('email', newEmail);
    });
    
   test('addPostBookmark - success', async () => {
        let response = await addPostBookmark(baseURL, testUser.username, 3, authToken);
        expect(response).to.have.property('status', 'success');
    });
    
   test('getUserBookmarks - success', async () => {
        let response = await getUserBookmarks(baseURL, testUser.username, authToken);
        console.log(response);
        // TODO: assertion for this test
    });  
   
   test('deleteBookmark - success', async () => {
        let response = await deleteBookmark(baseURL, testUser.username, 3, authToken);
        console.log(response);
       expect(response).to.have.property('status', 'success');
    });   
   
   test.skip('addPicture - success', async () => {
       // TODO
       let fileStream = fs.createReadStream("test\\beachhouse.jpeg");
        let response = await addPicture(baseURL, testUser.username, fileStream, authToken);
        console.log(response);
    });

});


describe('postService', () => {
    'use strict';

    test('getPost - success', async () => {
        let post = await getPost(baseURL, 5);
        console.log(post);
    });
});


describe('feedService', () => {
    'use strict';

    test('getFeedPosts - success', async () => {
        let posts = await getFeedPosts(
            baseURL,
            testUser.username,
            authToken,
            {
                onlyIds: false,
            }
        );
        expect(posts).to.be.an("array");
    });

    test('subscribeToChannel - success', async () => {
        let response = await subscribeToChannel(
            baseURL,
            testUser.username,
            'faberge',
            authToken,
        );
        expect(response).to.have.property("status").that.equals("success");
    });
});

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

/*
// Post is an aggregate entity of Releases along with socially interactive
   // components such as stars, posting user and comments attached to the post
   Post struct {
       ID               uint            `json:"id"`
       PostedByUsername string          `json:"PostedByUsername,omitempty"`
       OriginChannel    string          `json:"originChannel,omitempty"`
       Title            string          `json:"title"`
       Description      string          `json:"description"`
       ContentsID       []uint          `json:"contentsID"`
       Stars            map[string]uint `json:"stars"`
       CommentsID       []int           `json:"commentsID"`
       CreationTime     time.Time       `json:"creationTime"`
   }
 */