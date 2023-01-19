const {
    buildDeleteComment,
    deleteCommentSchema,
} = require("../delete-comment");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(deleteCommentSchema);

describe("deleteComment", () => {
    it("deletes comment correctly", async () => {
        const payload = {
            threadId: "thread-123",
            commentId: "comment-123",
            userId: "user-123",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentDB.verifyCommentAuthorization = jest.fn(() =>
            Promise.resolve()
        );
        mockCommentDB.deleteCommentById = jest.fn(() => Promise.resolve());

        const deleteComment = buildDeleteComment({
            validatePayload,
            commentDB: mockCommentDB,
            threadDB: mockThreadDB,
        });

        await expect(deleteComment(payload)).resolves.not.toThrowError();
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(mockCommentDB.verifyCommentAuthorization).toBeCalledWith({
            commentId: payload.commentId,
            userId: payload.userId,
        });
        expect(mockCommentDB.deleteCommentById).toBeCalledWith(
            payload.commentId
        );
    });
});
