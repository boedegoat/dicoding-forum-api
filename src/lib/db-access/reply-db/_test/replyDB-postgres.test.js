const pool = require("../../../db/postgres");
const buildReplyDBPostgres = require("../replyDB-postgres");
const userDBTest = require("../../../../../tests/userDBTest");
const threadDBTest = require("../../../../../tests/threadDBTest");
const commentDBTest = require("../../../../../tests/commentDBTest");
const replyDBTest = require("../../../../../tests/replyDBTest");
const NotFoundError = require("../../../errors/NotFoundError");
const AuthorizationError = require("../../../errors/AuthorizationError");

describe("replyDB-postgres", () => {
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

    describe("addReply", () => {
        it("adds and returns reply correctly", async () => {
            await userDBTest.addUser({ id: "user-1" });
            await threadDBTest.addThread({ id: "thread-1", userId: "user-1" });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const payload = {
                commentId: "comment-1",
                content: "a reply",
                userId: "user-1",
            };

            const expectedAddedReply = {
                id: "reply-1",
                content: payload.content,
                owner: payload.userId,
            };

            const replyDB = buildReplyDBPostgres({
                generateId: () => "1",
            });

            const actualAddedReply = await replyDB.addReply(payload);

            expect(actualAddedReply).toEqual(expectedAddedReply);
        });
    });

    describe("checkIsReplyExistById", () => {
        it("throws not found error if reply is not found", async () => {
            const replyId = "reply-1";

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            await expect(
                replyDB.checkIsReplyExistById(replyId)
            ).rejects.toThrowError(NotFoundError);
        });

        it("resolves and returns comment id if reply exist", async () => {
            const replyId = "reply-1";
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
                id: replyId,
                commentId: "comment-1",
                userId: "user-1",
            });

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            const actualReplyId = await replyDB.checkIsReplyExistById(replyId);
            expect(actualReplyId).toEqual(replyId);
        });
    });

    describe("verifyReplyAuthrorization", () => {
        it("throws authorization error if comment is not owned by user", async () => {
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

            const invalidPayload = {
                replyId: "reply-1",
                userId: "user-2",
            };

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            await expect(
                replyDB.verifyReplyAuthorization(invalidPayload)
            ).rejects.toThrowError(AuthorizationError);
        });

        it("resolves if comment is owned by user", async () => {
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

            const payload = {
                replyId: "reply-1",
                userId: "user-1",
            };

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            await expect(
                replyDB.verifyReplyAuthorization(payload)
            ).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe("deleteReplyById", () => {
        it("soft deletes reply correctly", async () => {
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

            const replyId = "reply-1";

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            await replyDB.deleteReplyById(replyId);

            // soft delete reply so its not deleted from database
            const replies = await replyDBTest.findRepliesById(replyId);
            expect(replies.length).toEqual(1);
            expect(replies[0].is_deleted).toEqual(true);
        });
    });

    describe("getRepliesByCommentIds", () => {
        it("returns comments replies correctly", async () => {
            await userDBTest.addUser({ id: "user-1", username: "ucup" });

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
                content: "reply",
            });
            await replyDBTest.addReply({
                id: "reply-2",
                commentId: "comment-1",
                userId: "user-1",
                content: "reply",
                isDeleted: true,
            });

            const expectedReturnedReplies = [
                {
                    id: "reply-1",
                    username: "ucup",
                    date: expect.any(Date),
                    content: "reply",
                    isDeleted: false,
                    commentId: "comment-1",
                },
                {
                    id: "reply-2",
                    username: "ucup",
                    date: expect.any(Date),
                    content: "reply",
                    isDeleted: true,
                    commentId: "comment-1",
                },
            ];

            const replyDB = buildReplyDBPostgres({
                generateId: {},
            });

            const actualReturnedReplies = await replyDB.getRepliesByCommentIds([
                "comment-1",
            ]);

            expect(actualReturnedReplies).toEqual(expectedReturnedReplies);
        });
    });
});
