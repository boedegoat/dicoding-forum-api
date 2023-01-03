const { buildGetThread, getThreadSchema } = require("../get-thread");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(getThreadSchema);

describe("getThread", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {};

        const getThread = buildGetThread({
            validatePayload,
            threadDB: {},
            commentDB: {},
        });

        await expect(getThread(invalidPayload)).rejects.toThrowError(
            "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const invalidPayload = {
            threadId: 1,
        };

        const getThread = buildGetThread({
            validatePayload,
            threadDB: {},
            commentDB: {},
        });

        await expect(getThread(invalidPayload)).rejects.toThrowError(
            "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("gets thread correctly that include all thread comments and replies", async () => {
        const payload = {
            threadId: "thread-1",
        };

        const expectedReturnedThread = {
            id: "thread-1",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
        };

        const expectedReturnedComments = [
            {
                id: "comment-1",
                username: "johndoe",
                date: "2021-08-08T07:22:33.555Z",
                content: "sebuah comment",
                replies: [
                    {
                        id: "reply-1",
                        content: "**balasan telah dihapus**",
                        date: "2021-08-08T07:59:48.766Z",
                        username: "johndoe",
                    },
                    {
                        id: "reply-2",
                        content: "sebuah balasan",
                        date: "2021-08-08T08:07:01.522Z",
                        username: "dicoding",
                    },
                ],
            },
        ];

        const expectedThread = {
            ...expectedReturnedThread,
            comments: expectedReturnedComments,
        };

        const mockThreadDB = {};
        const mockCommentDB = {};

        mockThreadDB.checkIsThreadExistById = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadDB.getThreadDetailsById = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedReturnedThread));
        mockCommentDB.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve(expectedReturnedComments)
            );

        const getThread = buildGetThread({
            validatePayload,
            threadDB: mockThreadDB,
            commentDB: mockCommentDB,
        });

        const actualThread = await getThread(payload);

        expect(actualThread).toEqual(expectedThread);
        expect(mockThreadDB.checkIsThreadExistById).toBeCalledWith(
            payload.threadId
        );
        expect(mockThreadDB.getThreadDetailsById).toBeCalledWith(
            payload.threadId
        );
        expect(mockCommentDB.getCommentsByThreadId).toBeCalledWith(
            payload.threadId
        );
    });
});
