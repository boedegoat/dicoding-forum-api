const buildAddReply = require("../add-reply");
const buildValidator = require("../../../lib/validator");

describe("addReply", () => {
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

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.checkIsCommentExistById = jest.fn(() =>
            Promise.resolve()
        );
        mockReplyDB.addReply = jest.fn(() =>
            Promise.resolve({
                id: "reply-1",
                content: payload.content,
                owner: payload.userId,
            })
        );

        const addReply = buildAddReply({
            buildValidator,
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
