const buildAddComment = require("../add-comment");
const buildValidator = require("../../../lib/validator");

describe("addComment", () => {
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

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());
        mockCommentDB.addComment = jest.fn(() =>
            Promise.resolve({
                id: "comment-123",
                content: payload.content,
                owner: payload.userId,
            })
        );

        const addComment = buildAddComment({
            buildValidator,
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
