const { buildGetThread, getThreadSchema } = require("../get-thread");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(getThreadSchema);

describe("getThread", () => {
    it("gets thread correctly that include all thread comments", async () => {
        const payload = {
            threadId: "thread-1",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};
        const mockReplyDB = {};

        mockThreadDB.checkIsThreadExistById = jest.fn(() => Promise.resolve());

        mockThreadDB.getThreadById = jest.fn(() =>
            Promise.resolve({
                id: "thread-1",
                title: "sebuah thread",
                body: "sebuah body thread",
                date: "2021-08-08T07:19:09.775Z",
                username: "dicoding",
            })
        );

        mockCommentDB.getCommentsByThreadId = jest.fn(() =>
            Promise.resolve([
                {
                    id: "comment-1",
                    username: "johndoe",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "comment",
                    is_deleted: false,
                },
            ])
        );

        mockReplyDB.getRepliesByCommentId = jest.fn(() => []);

        const expectedReturnedThread = {
            id: "thread-1",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: [
                {
                    id: "comment-1",
                    username: "johndoe",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "comment",
                },
            ],
        };

        const getThread = buildGetThread({
            validatePayload,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            replyDB: mockReplyDB,
        });

        const actualReturnedThread = await getThread(payload);

        expect(actualReturnedThread).toEqual(expectedReturnedThread);
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockThreadDB.getThreadById).toBeCalledWith(payload.threadId);
        expect(mockCommentDB.getCommentsByThreadId).toBeCalledWith(
            payload.threadId
        );
        expect(mockReplyDB.getRepliesByCommentId).toBeCalledWith("comment-1");
    });

    it("gets thread correctly that include all thread comments and replies", async () => {
        const payload = {
            threadId: "thread-1",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};
        const mockReplyDB = {};

        mockThreadDB.checkIsThreadExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockThreadDB.getThreadById = jest.fn(() =>
            Promise.resolve({
                id: "thread-1",
                title: "sebuah thread",
                body: "sebuah body thread",
                date: "2021-08-08T07:19:09.775Z",
                username: "dicoding",
            })
        );

        mockCommentDB.getCommentsByThreadId = jest.fn(() =>
            Promise.resolve([
                {
                    id: "comment-1",
                    username: "johndoe",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "sebuah comment",
                    is_deleted: true,
                },
            ])
        );

        mockReplyDB.getRepliesByCommentId = jest.fn(() => [
            {
                id: "reply-1",
                content: "sebuah balasan",
                date: "2021-08-08T07:59:48.766Z",
                username: "johndoe",
                is_deleted: false,
            },
            {
                id: "reply-2",
                content: "sebuah balasan",
                date: "2021-08-08T08:07:01.522Z",
                username: "dicoding",
                is_deleted: true,
            },
        ]);

        const expectedReturnedThread = {
            id: "thread-1",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: [
                {
                    id: "comment-1",
                    username: "johndoe",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "**komentar telah dihapus**",
                    replies: [
                        {
                            id: "reply-1",
                            content: "sebuah balasan",
                            date: "2021-08-08T07:59:48.766Z",
                            username: "johndoe",
                        },
                        {
                            id: "reply-2",
                            content: "**balasan telah dihapus**",
                            date: "2021-08-08T08:07:01.522Z",
                            username: "dicoding",
                        },
                    ],
                },
            ],
        };

        const getThread = buildGetThread({
            validatePayload,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            replyDB: mockReplyDB,
        });

        const actualReturnedThread = await getThread(payload);

        expect(actualReturnedThread).toEqual(expectedReturnedThread);
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockThreadDB.getThreadById).toBeCalledWith(payload.threadId);
        expect(mockCommentDB.getCommentsByThreadId).toBeCalledWith(
            payload.threadId
        );
        expect(mockReplyDB.getRepliesByCommentId).toBeCalledWith("comment-1");
    });
});
