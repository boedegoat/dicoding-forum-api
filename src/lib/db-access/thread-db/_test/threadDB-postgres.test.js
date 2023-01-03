const buildThreadDBPostgres = require("../threadDB-postgres");
const threadDBTest = require("../../../../../tests/threadDBTest");
const userDBTest = require("../../../../../tests/userDBTest");
const pool = require("../../../db/postgres");
const NotFoundError = require("../../../errors/NotFoundError");

describe("threadDB-postgres", () => {
    beforeEach(async () => {
        await Promise.all([userDBTest.cleanTable(), threadDBTest.cleanTable()]);
    });

    afterAll(async () => {
        await Promise.all([userDBTest.cleanTable(), threadDBTest.cleanTable()]);
        await pool.end();
    });

    describe("addThread", () => {
        it("adds and returns thread correctly", async () => {
            await userDBTest.addUser({ id: "user-123" });

            const payload = {
                title: "a thread",
                body: "thread body",
                userId: "user-123",
            };

            const expectedAddedThread = {
                id: "thread-123",
                title: payload.title,
                owner: payload.userId,
            };

            const threadDB = buildThreadDBPostgres({
                generateId: () => "123",
            });

            const actualAddedThread = await threadDB.addThread(payload);

            const threads = await threadDBTest.findThreadsById(
                actualAddedThread.id
            );
            expect(threads.length).toEqual(1);
            expect(actualAddedThread).toEqual(expectedAddedThread);
        });
    });

    describe("checkIsThreadExistById", () => {
        it("throws not found error if thread is not found", async () => {
            const threadId = "thread-123";

            const threadDB = buildThreadDBPostgres({
                generateId: {},
            });

            await expect(
                threadDB.checkIsThreadExistById(threadId)
            ).rejects.toThrowError(NotFoundError);
        });

        it("resolves and returns thread id if thread exist", async () => {
            const threadId = "thread-123";
            await userDBTest.addUser({ id: "user-123" });
            await threadDBTest.addThread({ id: threadId, userId: "user-123" });

            const threadDB = buildThreadDBPostgres({
                generateId: {},
            });

            const actualThreadId = await threadDB.checkIsThreadExistById(
                threadId
            );
            expect(actualThreadId).toEqual(threadId);
        });
    });

    describe("getThreadDetailsById", () => {
        it("returns thread details correctly", async () => {
            const threadId = "thread-1";

            await userDBTest.addUser({ id: "user-1", username: "udin" });

            const expectedThread = await threadDBTest.addThread(
                {
                    id: threadId,
                    userId: "user-1",
                    title: "title",
                    body: "body",
                },
                {
                    select: "id, title, body, date",
                }
            );
            expectedThread.username = "udin";

            const threadDB = buildThreadDBPostgres({
                generateId: {},
            });

            const actualThread = await threadDB.getThreadDetailsById(threadId);

            expect(actualThread).toEqual(expectedThread);
        });
    });
});
