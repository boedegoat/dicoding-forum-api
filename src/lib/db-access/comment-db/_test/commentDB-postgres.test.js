const pool = require("../../../db/postgres");
const buildCommentDBPostgres = require("../commentDB-postgres");
const threadDBTest = require("../../../../../tests/threadDBTest");
const commentDBTest = require("../../../../../tests/commentDBTest");
const userDBTest = require("../../../../../tests/userDBTest");
const NotFoundError = require("../../../errors/NotFoundError");
const AuthorizationError = require("../../../errors/AuthorizationError");
const replyDBTest = require("../../../../../tests/replyDBTest");

describe("commentDB-postgres", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
        await commentDBTest.cleanTable();
        await replyDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
        await commentDBTest.cleanTable();
        await replyDBTest.cleanTable();
        await pool.end();
    });

    describe("addComment", () => {
        it("adds and returns comment correctly", async () => {
            await userDBTest.addUser({ id: "user-123" });
            await threadDBTest.addThread({
                id: "thread-123",
                userId: "user-123",
            });

            const payload = {
                content: "a comment",
                threadId: "thread-123",
                userId: "user-123",
            };

            const expectedAddedComment = {
                id: "comment-123",
                content: payload.content,
                owner: payload.userId,
            };

            const commentDB = buildCommentDBPostgres({
                generateId: () => "123",
            });

            const actualAddedComment = await commentDB.addComment(payload);
            const comments = await commentDBTest.findCommentsById(
                actualAddedComment.id
            );

            expect(actualAddedComment).toEqual(expectedAddedComment);
            expect(comments.length).not.toEqual(0);
        });
    });

    describe("checkIsCommentExistById", () => {
        it("throws not found error if comment is not found", async () => {
            const commentId = "comment-123";

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await expect(
                commentDB.checkIsCommentExistById(commentId)
            ).rejects.toThrowError(NotFoundError);
        });

        it("resolves and returns comment id if comment exist", async () => {
            const commentId = "comment-123";
            await userDBTest.addUser({ id: "user-123" });
            await threadDBTest.addThread({
                id: "thread-123",
                userId: "user-123",
            });
            await commentDBTest.addComment({
                id: commentId,
                threadId: "thread-123",
                userId: "user-123",
            });

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            const actualCommentId = await commentDB.checkIsCommentExistById(
                commentId
            );
            expect(actualCommentId).toEqual(commentId);
        });
    });

    describe("verifyCommentAuthorization", () => {
        it("throws authorization error if comment is not owned by user", async () => {
            await userDBTest.addUser({ id: "user-456" });
            await threadDBTest.addThread({
                id: "thread-123",
                userId: "user-456",
            });
            await commentDBTest.addComment({
                id: "comment-123",
                threadId: "thread-123",
                userId: "user-456",
            });

            const invalidPayload = {
                commentId: "comment-123",
                userId: "user-123",
            };

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await expect(
                commentDB.verifyCommentAuthorization(invalidPayload)
            ).rejects.toThrowError(AuthorizationError);
        });

        it("resolves if comment is owned by user", async () => {
            await userDBTest.addUser({ id: "user-456" });
            await threadDBTest.addThread({
                id: "thread-123",
                userId: "user-456",
            });
            await commentDBTest.addComment({
                id: "comment-123",
                threadId: "thread-123",
                userId: "user-456",
            });

            const payload = {
                commentId: "comment-123",
                userId: "user-456",
            };

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await expect(
                commentDB.verifyCommentAuthorization(payload)
            ).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe("deleteCommentById", () => {
        it("soft deletes comment correctly", async () => {
            await userDBTest.addUser({ username: "udin", id: "user-1" });
            await userDBTest.addUser({ username: "umang", id: "user-2" });

            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-2",
            });

            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const commentId = "comment-1";

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await commentDB.deleteCommentById(commentId);

            // soft delete comment so its not deleted from database
            const comments = await commentDBTest.findCommentsById(commentId);
            expect(comments.length).toEqual(1);
            expect(comments[0].content).toEqual("**komentar telah dihapus**");
            expect(comments[0].is_deleted).toEqual(true);
        });
    });

    describe("getCommentsByThreadId", () => {
        it("returns all comments and replies inside a thread correctly", async () => {
            const userPayloads = [
                { username: "udin", id: "user-1" },
                { username: "umang", id: "user-2" },
                { username: "samsul", id: "user-3" },
            ];
            await Promise.all(
                userPayloads.map((payload) => userDBTest.addUser(payload))
            );

            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            const commentPayloads = [
                {
                    id: "comment-1",
                    threadId: "thread-1",
                    userId: "user-1",
                },
                {
                    id: "comment-2",
                    threadId: "thread-1",
                    userId: "user-2",
                    is_deleted: true,
                },
            ];

            let expectedComments = await Promise.all(
                commentPayloads.map((payload) =>
                    commentDBTest.addComment(payload, {
                        select: "id, date, content, owner",
                    })
                )
            );

            const replyPayloads = [
                {
                    id: "reply-1",
                    commentId: "comment-1",
                    userId: "user-2",
                },
                {
                    id: "reply-2",
                    commentId: "comment-1",
                    userId: "user-3",
                },
            ];

            const expectedReplies = await Promise.all(
                replyPayloads.map((payload) =>
                    replyDBTest.addReply(payload, {
                        select: "id, date, content, owner, comment_id",
                    })
                )
            );

            expectedComments = expectedComments.map(
                // change owner to username
                ({ owner, ...comment }) => ({
                    ...comment,
                    username: userPayloads.find((user) => user.id === owner)
                        .username,
                })
            );

            expectedReplies
                // change owner to username
                .map(({ owner, ...reply }) => ({
                    ...reply,
                    username: userPayloads.find((user) => user.id === owner)
                        .username,
                }))
                // put replies to expected comments
                .map(({ comment_id: commentId, ...reply }) => {
                    const commentIndex = expectedComments.findIndex(
                        (c) => c.id === commentId
                    );
                    if (expectedComments[commentIndex].replies) {
                        expectedComments[commentIndex].replies.push(reply);
                    } else {
                        expectedComments[commentIndex].replies = [reply];
                    }
                    return reply;
                });

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            const actualComments = await commentDB.getCommentsByThreadId(
                "thread-1"
            );

            expect(actualComments).toEqual(expectedComments);
        });
    });
});
