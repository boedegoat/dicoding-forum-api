const pool = require("../../../db/postgres");
const buildCommentLikeDBPostgres = require("../commentLikeDB-postgres");
const userDBTest = require("../../../../../tests/userDBTest");
const threadDBTest = require("../../../../../tests/threadDBTest");
const commentDBTest = require("../../../../../tests/commentDBTest");
const commentLikeDBTest = require("../../../../../tests/commentLikeDBTest");

describe("commentLikesDB-postgres", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
        await commentDBTest.cleanTable();
        await commentLikeDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await threadDBTest.cleanTable();
        await commentDBTest.cleanTable();
        await commentLikeDBTest.cleanTable();
        await pool.end();
    });

    describe("checkIsUserAlreadyLikedComment", () => {
        it("returns false if user hasn't liked the comment", async () => {
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

            const payload = { userId: "user-1", commentId: "comment-1" };

            const commentLikeDB = buildCommentLikeDBPostgres({
                generateId: {},
            });

            await expect(
                commentLikeDB.checkIsUserAlreadyLikedComment(payload)
            ).resolves.toEqual(false);
        });

        it("returns true if user already liked the comment", async () => {
            await userDBTest.addUser({ id: "user-1", username: "yanto" });
            await userDBTest.addUser({ id: "user-2", username: "jono" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });
            await commentLikeDBTest.addLike({
                commentId: "comment-1",
                userId: "user-2",
            });

            const payload = { userId: "user-2", commentId: "comment-1" };

            const commentLikeDB = buildCommentLikeDBPostgres({
                generateId: {},
            });

            await expect(
                commentLikeDB.checkIsUserAlreadyLikedComment(payload)
            ).resolves.toEqual(true);
        });
    });

    describe("likeComment", () => {
        it("likes comment correctly", async () => {
            await userDBTest.addUser({ id: "user-1", username: "yanto" });
            await userDBTest.addUser({ id: "user-2", username: "jono" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });

            const payload = { userId: "user-2", commentId: "comment-1" };

            const commentLikeDB = buildCommentLikeDBPostgres({
                generateId: () => "1",
            });

            await expect(
                commentLikeDB.likeComment(payload)
            ).resolves.not.toThrowError();

            const likes = await commentLikeDBTest.findLikesById(
                "comment-like-1"
            );
            expect(likes.length).toEqual(1);
        });
    });

    describe("unlikeComment", () => {
        it("unlikes comment correctly", async () => {
            await userDBTest.addUser({ id: "user-1", username: "yanto" });
            await userDBTest.addUser({ id: "user-2", username: "jono" });
            await threadDBTest.addThread({
                id: "thread-1",
                userId: "user-1",
            });
            await commentDBTest.addComment({
                id: "comment-1",
                threadId: "thread-1",
                userId: "user-1",
            });
            await commentLikeDBTest.addLike({
                id: "comment-like-1",
                commentId: "comment-1",
                userId: "user-2",
            });

            const payload = { userId: "user-2", commentId: "comment-1" };

            const commentLikeDB = buildCommentLikeDBPostgres({
                generateId: {},
            });

            await expect(
                commentLikeDB.unlikeComment(payload)
            ).resolves.not.toThrowError();

            const likes = await commentLikeDBTest.findLikesById(
                "comment-like-1"
            );
            expect(likes.length).toEqual(0);
        });
    });
});
