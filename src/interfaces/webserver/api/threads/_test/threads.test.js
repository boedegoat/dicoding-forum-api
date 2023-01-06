const userDBTest = require("../../../../../../tests/userDBTest");
const threadDBTest = require("../../../../../../tests/threadDBTest");
const commentDBTest = require("../../../../../../tests/commentDBTest");
const replyDBTest = require("../../../../../../tests/replyDBTest");
const pool = require("../../../../../lib/db/postgres");
const buildHapiServer = require("../../../hapi-server");
const { getAccessToken } = require("../../_utils");

describe("/threads route", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
        await pool.end();
    });

    describe("POST /threads", () => {
        it("responses 401 if user is not logged in", async () => {
            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads",
                payload: {},
            });

            expect(res.statusCode).toEqual(401);
        });

        it("responses 400 if payload not contain needed property", async () => {
            const invalidPayload = {
                body: "apakek",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads",
                payload: invalidPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 400 if payload not meet data type specs", async () => {
            const invalidPayload = {
                title: 0,
                body: {},
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads",
                payload: invalidPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 201 and persist threads if payload is correct", async () => {
            const payload = {
                title: "apakek",
                body: "apakek",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(201);
            expect(data.status).toEqual("success");
            expect(data.data.addedThread).toBeDefined();
        });
    });

    describe("POST /threads/{threadId}/comments", () => {
        it("responses 401 if user is not logged in", async () => {
            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload: {},
            });

            expect(res.statusCode).toEqual(401);
        });

        it("responses 400 if payload not contain needed property", async () => {
            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 400 if payload not meet data type specs", async () => {
            const invalidPayload = {
                content: {},
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload: invalidPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if threadId is not found", async () => {
            const payload = {
                content: "comment",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 201 if all payload is valid", async () => {
            await userDBTest.addUser({ id: "user-123" });
            await threadDBTest.addThread({
                id: "thread-123",
                userId: "user-123",
            });

            const payload = {
                content: "comment",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(201);
            expect(data.status).toEqual("success");
            expect(data.data.addedComment).toBeDefined();
        });
    });

    describe("DELETE /threads/{threadId}/comments/{commentId}", () => {
        it("responses 401 if user is not logged in", async () => {
            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1",
                payload: {},
            });

            expect(res.statusCode).toEqual(401);
        });

        it("responses 404 if thread is not found", async () => {
            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if comment is not found", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 403 if comment was not created by user", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(403);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 200 if comment found and created by user", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const testCommentRes = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments",
                payload: { content: "content" },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentId = JSON.parse(testCommentRes.payload).data
                .addedComment.id;

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: `/threads/thread-1/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(200);
            expect(data.status).toEqual("success");
        });
    });

    describe("GET /threads/{threadId}", () => {
        it("responses 404 if threadId is not found", async () => {
            const hapiServer = await buildHapiServer();

            const res = await hapiServer.server.inject({
                method: "GET",
                url: "/threads/thread-1",
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 200 and returns thread details with all comments included", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });
            await replyDBTest.addReply({
                id: "reply-id",
                commentId: "comment-1",
                userId: "user-1",
            });

            const hapiServer = await buildHapiServer();

            const res = await hapiServer.server.inject({
                method: "GET",
                url: "/threads/thread-1",
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(200);
            expect(data.data.thread).toBeDefined();
        });
    });

    describe("POST /threads/{threadId}/comments/{commentId}/replies", () => {
        it("responses 401 if user is not logged in", async () => {
            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload: {},
            });

            expect(res.statusCode).toEqual(401);
        });

        it("responses 400 if payload not contain needed property", async () => {
            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 400 if payload not meet data type specs", async () => {
            const invalidPayload = {
                content: {},
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload: invalidPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if threadId is not found", async () => {
            const payload = {
                content: "reply",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if commentId is not found", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({ id: "thread-1", userId: "user-1" });

            const payload = {
                content: "reply",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 201 if all payload is valid and returns added reply correctly", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({ id: "thread-1", userId: "user-1" });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const payload = {
                content: "reply",
            };

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(201);
            expect(data.status).toEqual("success");
            expect(data.data.addedReply).toBeDefined();
        });
    });

    describe("DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
        it("responses 401 if user is not logged in", async () => {
            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1/replies/reply-1",
                payload: {},
            });

            expect(res.statusCode).toEqual(401);
        });

        it("responses 404 if thread is not found", async () => {
            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1/replies/reply-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if comment is not found", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1/replies/reply-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 404 if reply is not found", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1/replies/reply-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(404);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 403 if reply was not created by user", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });
            await replyDBTest.addReply({
                id: "reply-1",
                commentId: "comment-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/threads/thread-1/comments/comment-1",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(403);
            expect(data.status).toEqual("fail");
            expect(typeof data.message).toEqual("string");
            expect(data.message).not.toEqual("");
        });

        it("responses 200 if comment found and created by user", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const [hapiServer, accessToken] = await Promise.all([
                buildHapiServer(),
                getAccessToken(),
            ]);

            const testReplyRes = await hapiServer.server.inject({
                method: "POST",
                url: "/threads/thread-1/comments/comment-1/replies",
                payload: { content: "reply" },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const replyId = JSON.parse(testReplyRes.payload).data.addedReply.id;

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: `/threads/thread-1/comments/comment-1/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(200);
            expect(data.status).toEqual("success");
        });
    });
});
