const { buildDeleteReply, deleteReplySchema } = require("../delete-reply");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(deleteReplySchema);

describe("deleteReply", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {
            threadId: "thread-1",
        };

        const deleteReply = buildDeleteReply({
            validatePayload,
            threadDB: {},
            commentDB: {},
            replyDB: {},
        });

        await expect(deleteReply(invalidPayload)).rejects.toThrowError(
            "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const invalidPayload = {
            threadId: 1,
            commentId: 2,
            reply: 3,
            userId: false,
        };

        const deleteComment = buildDeleteReply({
            validatePayload,
            threadDB: {},
            commentDB: {},
            replyDB: {},
        });

        await expect(deleteComment(invalidPayload)).rejects.toThrowError(
            "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

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

        mockThreadDB.checkIsThreadExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyDB.checkIsReplyExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyDB.verifyReplyAuthorization = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyDB.deleteReplyById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const deleteComment = buildDeleteReply({
            validatePayload,
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
