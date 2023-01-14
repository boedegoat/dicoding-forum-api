const { buildAddThread, addThreadSchema } = require("../add-thread");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(addThreadSchema);

describe("addThread", () => {
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
        mockThreadDB.addThread = jest.fn(() =>
            Promise.resolve({
                id: "thread-123",
                title: payload.title,
                owner: payload.userId,
            })
        );

        const addThread = buildAddThread({
            validatePayload,
            threadDB: mockThreadDB,
        });

        const actualAddedThread = await addThread(payload);

        expect(actualAddedThread).toEqual(expectedAddedThread);
        expect(mockThreadDB.addThread).toBeCalledWith(payload);
    });
});
