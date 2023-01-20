const buildLikeComment = require("../like-comment");
const buildValidator = require("../../../lib/validator");

describe("likeComment", () => {
    it("adds like to comment if user hasn't liked the comment", async () => {
        const payload = {
            threadId: "thread-1",
            commentId: "comment-1",
            userId: "user-1",
        };

        const mockCommentDB = {};
        const mockCommentLikeDB = {};
        const mockThreadDB = {};

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentLikeDB.checkIsUserAlreadyLikedComment = jest.fn(() =>
            Promise.resolve(false)
        );
        mockCommentLikeDB.likeComment = jest.fn(() => Promise.resolve());
        mockCommentLikeDB.unlikeComment = jest.fn(() => Promise.resolve());

        const likeComment = buildLikeComment({
            buildValidator,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            commentLikeDB: mockCommentLikeDB,
        });

        await expect(likeComment(payload)).resolves.not.toThrowError();
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(mockCommentLikeDB.checkIsUserAlreadyLikedComment).toBeCalledWith(
            {
                userId: payload.userId,
                commentId: payload.commentId,
            }
        );
        expect(mockCommentLikeDB.likeComment).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikeDB.unlikeComment).not.toBeCalled();
    });

    it("removes like from comment if user already liked the comment", async () => {
        const payload = {
            threadId: "thread-1",
            commentId: "comment-1",
            userId: "user-1",
        };

        const mockCommentDB = {};
        const mockCommentLikeDB = {};
        const mockThreadDB = {};

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentLikeDB.checkIsUserAlreadyLikedComment = jest.fn(() =>
            Promise.resolve(true)
        );
        mockCommentLikeDB.unlikeComment = jest.fn(() => Promise.resolve());
        mockCommentLikeDB.likeComment = jest.fn(() => Promise.resolve());

        const likeComment = buildLikeComment({
            buildValidator,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            commentLikeDB: mockCommentLikeDB,
        });

        await expect(likeComment(payload)).resolves.not.toThrowError();
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(mockCommentLikeDB.checkIsUserAlreadyLikedComment).toBeCalledWith(
            {
                userId: payload.userId,
                commentId: payload.commentId,
            }
        );
        expect(mockCommentLikeDB.unlikeComment).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikeDB.likeComment).not.toBeCalled();
    });
});
