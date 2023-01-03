const {
    buildDeleteComment,
    deleteCommentSchema,
} = require("../delete-comment");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(deleteCommentSchema);

describe("deleteComment", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {
            threadId: "thread-123",
        };

        const deleteComment = buildDeleteComment({
            validatePayload,
            commentDB: {},
        });

        await expect(deleteComment(invalidPayload)).rejects.toThrowError(
            "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const invalidPayload = {
            threadId: "thread-123",
            commentId: "comment-123",
            userId: false,
        };

        const deleteComment = buildDeleteComment({
            validatePayload,
            commentDB: {},
        });

        await expect(deleteComment(invalidPayload)).rejects.toThrowError(
            "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("deletes comment correctly", async () => {
        const payload = {
            threadId: "thread-123",
            commentId: "comment-123",
            userId: "user-123",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};

        mockThreadDB.checkIsThreadExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentDB.verifyCommentAuthorization = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentDB.deleteCommentById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

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
