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
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            const payload = {
                content: "a comment",
                threadId: "thread-1",
                userId: "user-1",
            };

            const expectedAddedComment = {
                id: "comment-1",
                content: payload.content,
                owner: payload.userId,
            };

            const commentDB = buildCommentDBPostgres({
                generateId: () => "1",
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
            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await expect(
                commentDB.checkIsCommentExistById("comment-1")
            ).rejects.toThrowError(NotFoundError);
        });

        it("resolves if comment exist", async () => {
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

            const commentDB = buildCommentDBPostgres({
                generateId: {},
            });

            await expect(
                commentDB.checkIsCommentExistById("comment-1")
            ).resolves.not.toThrowError(NotFoundError);
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
            expect(comments[0].is_deleted).toEqual(true);
        });
    });

    describe("getCommentsByThreadId", () => {
        it("returns all comments and replies inside a thread correctly", async () => {
            await userDBTest.addUser({ username: "udin", id: "user-1" });
            await userDBTest.addUser({ username: "umang", id: "user-2" });
            await userDBTest.addUser({ username: "samsul", id: "user-3" });

            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });

            await commentDBTest.addComment({
                id: "comment-1",
                content: "comment",
                threadId: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-2",
                content: "comment",
                threadId: "thread-1",
                userId: "user-2",
                isDeleted: true,
            });

            await replyDBTest.addReply({
                id: "reply-1",
                commentId: "comment-1",
                userId: "user-2",
            });
            await replyDBTest.addReply({
                id: "reply-2",
                commentId: "comment-1",
                userId: "user-3",
            });

            const expectedComments = [
                {
                    id: "comment-1",
                    date: expect.any(Date),
                    username: "udin",
                    content: "comment",
                    isDeleted: false,
                },
                {
                    id: "comment-2",
                    date: expect.any(Date),
                    username: "umang",
                    content: "comment",
                    isDeleted: true,
                },
            ];

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
