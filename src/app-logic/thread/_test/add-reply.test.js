const { buildAddReply, addReplySchema } = require("../add-reply");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(addReplySchema);

describe("addReply", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {
            commentId: "comment-1",
            content: "reply",
        };

        const addReply = buildAddReply({
            validatePayload,
            threadDB: {},
            commentDB: {},
            replyDB: {},
        });

        await expect(addReply(invalidPayload)).rejects.toThrowError(
            "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const invalidPayload = {
            threadId: "thread-1",
            commentId: "comment-1",
            userId: 1,
            content: "reply",
        };

        const addReply = buildAddReply({
            validatePayload,
            threadDB: {},
            commentDB: {},
            replyDB: {},
        });

        await expect(addReply(invalidPayload)).rejects.toThrowError(
            "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("adds reply correctly", async () => {
        const payload = {
            threadId: "thread-1",
            commentId: "comment-1",
            userId: "user-1",
            content: "reply",
        };

        const expectedAddedReply = {
            id: "reply-1",
            content: payload.content,
            owner: payload.userId,
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
        mockReplyDB.addReply = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: "reply-1",
                content: payload.content,
                owner: payload.userId,
            })
        );

        const addReply = buildAddReply({
            validatePayload,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            replyDB: mockReplyDB,
        });

        const actualAddedReply = await addReply(payload);

        expect(actualAddedReply).toEqual(expectedAddedReply);
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.checkIsCommentExistById).toBeCalledWith(
            payload.commentId
        );
        expect(mockReplyDB.addReply).toBeCalledWith(payload);
    });
});
