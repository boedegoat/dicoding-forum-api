const { buildAddComment, addCommentSchema } = require("../add-comment");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(addCommentSchema);

describe("addComment", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {};

        const addComment = buildAddComment({
            validatePayload,
            commentDB: {},
            threadDB: {},
        });

        await expect(addComment(invalidPayload)).rejects.toThrowError(
            "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const invalidPayload = {
            content: "content",
            threadId: 123,
            userId: 123,
        };

        const addComment = buildAddComment({
            validatePayload,
            commentDB: {},
            threadDB: {},
        });

        await expect(addComment(invalidPayload)).rejects.toThrowError(
            "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("adds a new comment to a thread that sets user as the owner", async () => {
        const payload = {
            content: "content",
            threadId: "thread-123",
            userId: "user-123",
        };

        const expectedAddedComment = {
            id: "comment-123",
            content: payload.content,
            owner: payload.userId,
        };

        const mockThreadDB = {};
        const mockCommentDB = {};

        mockThreadDB.checkIsThreadExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentDB.addComment = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: "comment-123",
                content: payload.content,
                owner: payload.userId,
            })
        );

        const addComment = buildAddComment({
            validatePayload,
            commentDB: mockCommentDB,
            threadDB: mockThreadDB,
        });

        const actualAddedComment = await addComment(payload);

        expect(actualAddedComment).toEqual(expectedAddedComment);
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.addComment).toBeCalledWith(payload);
    });
});
