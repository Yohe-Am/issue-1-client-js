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
    updateUser,
    addPicture,
    deleteBookmark,
    getUserBookmarks
} from "../lib/user";

import {
    getPost
} from "../lib/post.js";

import {
    getFeedPosts,
    subscribeFeedToChannel,
    getFeed,
    getFeedSubscriptions,
    setDefaultFeedSorting,
    unsubscribeFeedFromChannel
} from "../lib/feed.js";

import {
    addAdminToChannel,
    addChannel,
    changeChannelOwner,
    deleteChannel,
    getAdmins,
    getCatalog,
    getChannel,
    getChannelPost,
    getChannelPosts,
    getChannels,
    getOfficialCatalog,
    getOwner,
    getReleaseFromCatalog,
    getReleaseFromOfficialCatalog,
    getStickiedPosts,
    removeAdminFromChannel,
    searchChannels,
    updateChannel
} from "../lib/channel";

import {beforeAll, describe} from "@jest/globals";
import fs from 'fs';
import {
    addPost,
    deletePost,
    getPostReleases,
    getPosts, getPostStarOfUser,
    getPostStars,
    searchPosts, starPost,
    updatePost
} from "../lib/post";
import {addComment, addReply, deleteComment, getComment, getComments, getReplies, updateComment} from "../lib/comment";
import {searchIssue1} from "../lib/search";

const baseURL = "http://localhost:8080";

const testUser = {
    username: 'Cobotbol',
    email: "paper.bug@hot.ping",
    firstName: 'Jeff',
    lastName: 'Poisonne',
    password: 'password'
};

const testChannel = {
    channelUsername: 'axesteel',
    name: 'Anaerobic Love',
    description: 'Still Waiting In The Car',
    ownerUsername: 'Cobotbol',
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
        let response = await deleteUser(baseURL, testUser.username, authToken);
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
        let user = await updateUser(baseURL, testUser.username, {email: newEmail}, authToken);
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

    const testPost = {
        postedByUsername: testUser.username,
        originChannel: testChannel.channelUsername,
        title: 'Have mercy, love.',
        description: 'Mercy, darling.',
    };

    test('getPost - success', async () => {
        let post = await getPost(baseURL, 7);
        expect(post).to.have.property('title', testPost.title);
    });

    test('getPosts - success', async () => {
        let posts = await getPosts(baseURL);
        expect(posts).to.be.an('array');
    });

    test('searchPosts - success', async () => {
        let posts = await searchPosts(baseURL, testPost.title);
        expect(posts).to.be.an('array');
        expect(posts[0]).to.have.property('description', testPost.description);
    });

    test.skip('addPost - success', async () => {
        let post = await addPost(baseURL, testPost, authToken);
        expect(post).to.have.property('title', testPost.title);
    });

    test('deletePost - success', async () => {
        let response = await deletePost(baseURL, 8, authToken);
        expect(response).to.have.property("status", "success");
    });

    test('updatePost - success', async () => {
        let newDescription = "Feed me with gasoline";
        let post = await updatePost(
            baseURL,
            7,
            {
                description: newDescription
            },
            authToken);
        expect(post).to.have.property("description", `<p>${newDescription}</p>\n`);
    });

    test('getPostReleases - success', async () => {
        let releases = await getPostReleases(baseURL, 7);
        expect(releases).to.be.an('array');
    });

    test('getPostStars - success', async () => {
        let stars = await getPostStars(baseURL, 7);
        expect(stars).to.be.an('array');
    });

    test('starPost - success', async () => {
        let stars = await starPost(baseURL, 7, 3, testUser.username, authToken);
        expect(stars).to.have.property("stars", 3);
    });

    test('getPostStarOfUser - success', async () => {
        let stars = await getPostStarOfUser(baseURL, 7, testUser.username);
        expect(stars).to.have.property("username", testUser.username);
    });

});

describe('commentService', () => {
    'use strict';

    const testComment = {
        // id = 18
        commenter: testUser.username,
        originPost: 7,
        content: 'I found you lying where I drowned you.',
    };

    test.skip('addComment - success', async () => {
        let comment = await addComment(baseURL, testComment, 7, authToken);
        expect(comment).to.have.property('commenter', testComment.commenter);
    });

    test.skip('addReply - success', async () => {
        const testReply = {
            replyTo: 18,
            commenter: testUser.username,
            originPost: 7,
            content: 'A dirty black room.',
        };
        let reply = await addReply(baseURL, testReply, 7, 18, authToken);
        console.log(reply);
        expect(reply).to.have.property('commenter', testReply.commenter);
    });

    test('getComment - success', async () => {
        let comment = await getComment(baseURL, 18, 7);
        expect(comment).to.have.property('commenter', testComment.commenter);
    });

    test('getComments - success', async () => {
        let comments = await getComments(baseURL, 7);
        console.log(comments);
        expect(comments).to.be.an('array');
    });

    test('getReplies - success', async () => {
        let replies = await getReplies(baseURL, 18, 7);
        console.log(replies);
        expect(replies).to.be.an('array');
    });

    test('updateComment - success', async () => {
        let newContent = "trippy electronic love songs";
        let channel = await updateComment(
            baseURL,
            18,
            7,
            {content: newContent},
            authToken);
        expect(channel).to.have.property('content', `<p>${newContent}</p>`);
    });

    test('deleteComment - success', async () => {
        let response = await deleteComment(baseURL, 19, 7, authToken);
        expect(response).to.have.property("status", "success");
    });
});

describe('channelService', () => {
    'use strict';

    test.skip('addChannel - success', async () => {
        let channel = await addChannel(baseURL, testChannel, authToken);
        expect(channel).to.have.property('channelUsername', testChannel.channelUsername);
    });

    test.skip('addChannel - other owner username', async () => {
        const fakeChannel = {
            channelUsername: 'icehead',
            name: 'Baba Yaga',
            description: 'Blood Flowing In The Streets',
            ownerUsername: 'loveless',
        };
        let channel = await addChannel(baseURL, fakeChannel, authToken);
        console.log(channel);
        expect(channel).to.have.property('ownerUsername', testUser.username);
    });

    test('getChannel - success', async () => {
        let channel = await getChannel(baseURL, testChannel.channelUsername);
        expect(channel).to.have.property('channelUsername', testChannel.channelUsername);
    });

    test('getChannel - authorized - success', async () => {
        let channel = await getChannel(baseURL, testChannel.channelUsername, authToken);
        expect(channel).to.have.property('channelUsername', testChannel.channelUsername);
    });

    test('getChannels - success', async () => {
        let channels = await getChannels(baseURL);
        expect(channels).to.be.an('array');
    });

    test('searchChannels - success', async () => {
        let channels = await searchChannels(baseURL, testChannel.name);
        expect(channels).to.be.an('array');
        expect(channels[0]).to.have.property('channelUsername', testChannel.channelUsername);
    });

    test('updateChannel - success', async () => {
        let newDescription = "Sun's Coming Down";
        let channel = await updateChannel(
            baseURL,
            'icehead',
            {description: newDescription},
            authToken);
        expect(channel).to.have.property('description', newDescription);
    });

    test('deleteChannel - success', async () => {
        let response = await deleteChannel(baseURL, 'icehead', authToken);
        expect(response).to.have.property("status", "success");
    });

    test('addAdminToChannel - success', async () => {
        let response = await addAdminToChannel(
            baseURL,
            'icehead',
            'loveless',
            authToken);
        expect(response).to.have.property("status", "success");
    });

    test('removeAdminFromChannel - success', async () => {
        let response = await removeAdminFromChannel(
            baseURL,
            testChannel.channelUsername,
            'loveless',
            authToken);
        expect(response).to.have.property("status", "success");
    });

    test('changeChannelOwner - success', async () => {
        let response = await changeChannelOwner(
            baseURL,
            'icehead',
            'loveless',
            authToken);
        expect(response).to.have.property("status", "success");
    });

    test('getChannelPosts - success', async () => {
        let posts = await getChannelPosts(
            baseURL,
            testChannel.channelUsername
        );
        expect(posts).to.be.an("array");
    });

    test('getChannelPost - success', async () => {
        let post = await getChannelPost(
            baseURL,
            'chromagnum',
            6
        );
        expect(post).to.be.have.property("postedByUsername", 'rembrandt');
    });

    test('getCatalog - success', async () => {
        let releases = await getCatalog(
            baseURL,
            testChannel.channelUsername,
            authToken
        );
        expect(releases).to.be.an("array");
    });

    test('getOfficialCatalog - success', async () => {
        let releases = await getOfficialCatalog(
            baseURL,
            'chromagnum',
        );
        expect(releases).to.be.an("array");
    });

    test('getReleaseFromOfficialCatalog - success', async () => {
        let release = await getReleaseFromOfficialCatalog(
            baseURL,
            'chromagnum',
            6
        );
        expect(release).to.be.have.property("ownerChannel", 'chromagnum');
    });

    test('getReleaseFromCatalog - success', async () => {
        let release = await getReleaseFromCatalog(
            baseURL,
            testChannel.channelUsername,
            6
        );
        expect(release).to.be.have.property("ownerChannel", testChannel.channelUsername);
    });

    test('getStickiedPosts - success', async () => {
        let posts = await getStickiedPosts(
            baseURL,
            'chromagnum',
        );
        expect(posts).to.be.be.an("array");
    });

    test('getAdmins - success', async () => {
        let admins = await getAdmins(
            baseURL,
            testChannel.channelUsername,
            authToken
        );
        expect(admins).to.be.be.an("array");
    });

    test('getOwner - success', async () => {
        let owner = await getOwner(
            baseURL,
            testChannel.channelUsername,
            authToken
        );
        expect(owner).to.be.be.an("string");
    });

    // TODO: test for adding and removing releases from catalog
    // TODO: test for stickying posts
});

describe('feedService', () => {
    'use strict';

    test('getFeed - success', async () => {
        let feed = await getFeed(baseURL, testUser.username, authToken);
        expect(feed).to.be.have.property('ownerUsername', testUser.username);
    });

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

    test('getFeedSubscriptions - success', async () => {
        let subs = await getFeedSubscriptions(
            baseURL,
            testUser.username,
            authToken,
        );
        console.log(subs);
        //TODO: assertion for this test
    });

    test('subscribeFeedToChannel - success', async () => {
        let response = await subscribeFeedToChannel(
            baseURL,
            testUser.username,
            'faberge',
            authToken,
        );
        expect(response).to.have.property("status", "success");
    });

    test('unsubscribeFeedFromChannel - success', async () => {
        let response = await unsubscribeFeedFromChannel(
            baseURL,
            testUser.username,
            'faberge',
            authToken,
        );
        expect(response).to.have.property("status", "success");
    });

    test('setDefaultFeedSorting - success', async () => {
        let response = await setDefaultFeedSorting(
            baseURL,
            testUser.username,
            'new',
            authToken,
        );
        expect(response).to.have.property("status", "success");
    });

});

describe('searchService', () => {
    'use strict';
    
    test('search - success', async () => {
        let result = await searchIssue1(baseURL, 'love');
        expect(result).to.have.property('posts').that.is.an('array');
    });
});