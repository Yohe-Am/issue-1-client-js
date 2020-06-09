// import 'chai/register-should';
import 'chai/register-expect';

import {
    getAuthToken,
    refreshAuthToken,
    logout
} from '../lib/auth.js';

import {
    addUser,
    getUser
} from '../lib/user.js';

import {
    getPost
} from "../lib/post.js";

import {
    getFeedPosts,
    subscribeToChannel
} from "../lib/feed.js";

const baseURL = "http://localhost:8080";

const testUser = {
    username: 'Cobotbol',
    email: "paper.bug@hot.ping",
    firstName: 'Jeff',
    lastName: 'Poisonne',
    password: 'password'
};

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
            var refreshedToken = await refreshAuthToken(baseURL, authToken);
        } catch (error) {
            expect(error).to.have.property('response')
                .that.has.property('status')
                .that.equals(401);
        }
    });

    test.only('logout - success', async () => {
        var authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
        var response = await logout(baseURL, authToken);
        console.log(response);
    });

    /* 
        test('getsAuthToken - non-existent username', () => {
            expect(myBeverage.delicious).toBeTruthy();
        });
    
        test('getsAuthToken - missing password', () => {
            expect(myBeverage.delicious).toBeTruthy();
        });
    
        test('getsAuthToken - missing username', () => {
            expect(myBeverage.delicious).toBeTruthy();
        }); */

});

describe('userService', () => {
    'use strict';

    test('getsUser - success', async () => {
        let user = await getUser(baseURL, testUser.username);
        expect(user).to.have.property('username', testUser.username);
        expect(user).to.have.property('firstName', testUser.firstName);
        expect(user).to.have.property('lastName', testUser.lastName);
    });
    /*  
    {  // add user
         await testAsyncFn(addUser, baseURL, testUser);
     }
     
     { // getUser - nonauthorized
 
         await testAsyncFn(getUser, baseURL, testUser.username);
     } 
         

     */
    /* { // getUser - authorized
        let token = await getAuthToken(baseURL, testUser.username, testUser.password);
        console.log("got token");
        await testFruitfulAsyncFn(getUser, baseURL, testUser.username, token);
    } */

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

    let authToken;
    /*     beforeAll(async () => {
            authToken = await getAuthToken(baseURL, testUser.username, testUser.password);
        });
     */
    test('getFeedPosts - success', async () => {
        let posts = await getFeedPosts(
            baseURL,
            testUser.username,
            authToken,
            {
                onlyIds: true,
            }
        );
        console.log(posts);
    });

    test('getFeedPosts - bad token', async () => {
        let posts = await getFeedPosts(
            baseURL,
            testUser.username,
            authToken = "badteokeoen",
            {
                onlyIds: true,
            }
        );
        console.log(posts);
    });

    test('subscribeToChannel - success', async () => {
        let result = await subscribeToChannel(
            baseURL,
            testUser.username,
            'chromagnum',
            authToken,
        );
        console.log(result);
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