const buildDeleteReply = require("../delete-reply");
const buildValidator = require("../../../lib/validator");

describe("deleteReply", () => {
    it("deletes reply correctly", async () => {
        const payload = {
            threadId: "thread-1",
            commentId: "comment-1",
            replyId: "reply-1",
            userId: "user-1",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};
        const mockReplyDB = {};

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockReplyDB.checkIsReplyExistById = jest.fn(() => Promise.resolve());
        mockReplyDB.verifyReplyAuthorization = jest.fn(() => Promise.resolve());
        mockReplyDB.deleteReplyById = jest.fn(() => Promise.resolve());

        const deleteComment = buildDeleteReply({
            buildValidator,
            commentDB: mockCommentDB,
            threadDB: mockThreadDB,
            replyDB: mockReplyDB,
        });

        await expect(deleteComment(payload)).resolves.not.toThrowError();
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(mockReplyDB.checkIsReplyExistById).toBeCalledWith(
            payload.replyId
        );
        expect(mockReplyDB.verifyReplyAuthorization).toBeCalledWith({
            replyId: payload.replyId,
            userId: payload.userId,
        });
        expect(mockReplyDB.deleteReplyById).toBeCalledWith(payload.replyId);
    });
});
