const { buildAddThread, addThreadSchema } = require("../add-thread");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(addThreadSchema);

describe("addThread", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const payload = {
            title: "a thread",
        };

        const addThread = buildAddThread({
            validatePayload,
            threadDB: {},
        });

        await expect(addThread(payload)).rejects.toThrowError(
            "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload data type is wrong", async () => {
        const payload = {
            title: 10,
            body: ["lorem ipsum"],
            userId: "user-123",
        };

        const addThread = buildAddThread({
            validatePayload,
            threadDB: {},
        });

        await expect(addThread(payload)).rejects.toThrowError(
            "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("adds a new thread that sets user as the owner", async () => {
        const payload = {
            title: "a thread",
            body: "lorem ipsum",
            userId: "user-123",
        };

        const expectedAddedThread = {
            id: "thread-123",
            title: payload.title,
            owner: payload.userId,
        };

        const mockThreadDB = {};
        mockThreadDB.addThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));

        const addThread = buildAddThread({
            validatePayload,
            threadDB: mockThreadDB,
        });

        const actualAddedThread = await addThread(payload);

        expect(actualAddedThread).toEqual(expectedAddedThread);
        expect(mockThreadDB.addThread).toBeCalledWith(payload);
    });
});
