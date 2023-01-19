const buildLikeComment = require("../like-comment");
const buildValidator = require("../../../lib/validator");

describe("likeComment", () => {
    it("adds like to comment if user hasn't liked the comment", async () => {
        const payload = {
            commentId: "comment-1",
            userId: "user-1",
        };

        const mockCommentDB = {};
        const mockCommentLikesDB = {};

        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentLikesDB.checkIsUserAlreadyLikedComment = jest.fn(() =>
            Promise.resolve(false)
        );
        mockCommentLikesDB.likeComment = jest.fn(() => Promise.resolve());
        mockCommentLikesDB.unlikeComment = jest.fn(() => Promise.resolve());

        const likeComment = buildLikeComment({
            buildValidator,
            commentDB: mockCommentDB,
            commentLikesDB: mockCommentLikesDB,
        });

        await expect(likeComment(payload)).resolves.not.toThrowError();
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(
            mockCommentLikesDB.checkIsUserAlreadyLikedComment
        ).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikesDB.likeComment).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikesDB.unlikeComment).not.toBeCalled();
    });

    it("removes like from comment if user already liked the comment", async () => {
        const payload = {
            commentId: "comment-1",
            userId: "user-1",
        };

        const mockCommentDB = {};
        const mockCommentLikesDB = {};

        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentLikesDB.checkIsUserAlreadyLikedComment = jest.fn(() =>
            Promise.resolve(true)
        );
        mockCommentLikesDB.unlikeComment = jest.fn(() => Promise.resolve());
        mockCommentLikesDB.likeComment = jest.fn(() => Promise.resolve());

        const likeComment = buildLikeComment({
            buildValidator,
            commentDB: mockCommentDB,
            commentLikesDB: mockCommentLikesDB,
        });

        await expect(likeComment(payload)).resolves.not.toThrowError();
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(
            mockCommentLikesDB.checkIsUserAlreadyLikedComment
        ).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikesDB.unlikeComment).toBeCalledWith({
            userId: payload.userId,
            commentId: payload.commentId,
        });
        expect(mockCommentLikesDB.likeComment).not.toBeCalled();
    });
});
