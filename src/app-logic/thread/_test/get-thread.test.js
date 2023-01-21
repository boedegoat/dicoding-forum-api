const buildGetThread = require("../get-thread");
const buildValidator = require("../../../lib/validator");

describe("getThread", () => {
    it("gets thread correctly that include all thread comments", async () => {
        const payload = {
            threadId: "thread-1",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};
        const mockReplyDB = {};
        const mockCommentLikeDB = {};

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
                    isDeleted: false,
                },
                {
                    id: "comment-2",
                    username: "udin",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "comment",
                    isDeleted: false,
                },
            ])
        );

        mockCommentLikeDB.getLikesByCommentIds = jest.fn(() =>
            Promise.resolve([
                {
                    commentId: "comment-1",
                    likeCount: 3,
                },
            ])
        );

        mockReplyDB.getRepliesByCommentIds = jest.fn(() => Promise.resolve([]));

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
                    likeCount: 3,
                },
                {
                    id: "comment-2",
                    username: "udin",
                    date: "2021-08-08T07:22:33.555Z",
                    content: "comment",
                    likeCount: 0,
                },
            ],
        };

        const getThread = buildGetThread({
            buildValidator,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            replyDB: mockReplyDB,
            commentLikeDB: mockCommentLikeDB,
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
        expect(mockCommentLikeDB.getLikesByCommentIds).toBeCalledWith([
            "comment-1",
            "comment-2",
        ]);
        expect(mockReplyDB.getRepliesByCommentIds).toBeCalledWith([
            "comment-1",
            "comment-2",
        ]);
    });

    it("gets thread correctly that include all thread comments and replies", async () => {
        const payload = {
            threadId: "thread-1",
        };

        const mockThreadDB = {};
        const mockCommentDB = {};
        const mockReplyDB = {};
        const mockCommentLikeDB = {};

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
                    isDeleted: true,
                },
            ])
        );

        mockCommentLikeDB.getLikesByCommentIds = jest.fn(() =>
            Promise.resolve([
                {
                    commentId: "comment-1",
                    likeCount: 3,
                },
            ])
        );

        mockReplyDB.getRepliesByCommentIds = jest.fn(() =>
            Promise.resolve([
                {
                    id: "reply-1",
                    content: "sebuah balasan",
                    date: "2021-08-08T07:59:48.766Z",
                    username: "johndoe",
                    isDeleted: false,
                    commentId: "comment-1",
                },
                {
                    id: "reply-2",
                    content: "sebuah balasan",
                    date: "2021-08-08T08:07:01.522Z",
                    username: "dicoding",
                    isDeleted: true,
                    commentId: "comment-1",
                },
            ])
        );

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
                    likeCount: 3,
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
            buildValidator,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
            replyDB: mockReplyDB,
            commentLikeDB: mockCommentLikeDB,
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
        expect(mockCommentLikeDB.getLikesByCommentIds).toBeCalledWith([
            "comment-1",
        ]);
        expect(mockReplyDB.getRepliesByCommentIds).toBeCalledWith([
            "comment-1",
        ]);
    });
});
