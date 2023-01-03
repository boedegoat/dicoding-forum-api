const buildUserDBPostgres = require("../userDB-postgres");
const userDBTest = require("../../../../../tests/userDBTest");
const pool = require("../../../db/postgres");
const InvariantError = require("../../../errors/InvariantError");

describe("userDB-postgres", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await pool.end();
    });

    describe("verifyUsername", () => {
        it("throws InvariantError if username already taken", async () => {
            await userDBTest.addUser({ username: "samsul" });
            const userDB = buildUserDBPostgres({
                generateId: {},
            });
            await expect(userDB.verifyUsername("samsul")).rejects.toThrowError(
                InvariantError
            );
        });

        it("is not throwing InvariantError if username available", async () => {
            const userDB = buildUserDBPostgres({
                generateId: {},
            });
            await expect(
                userDB.verifyUsername("samsul")
            ).resolves.not.toThrowError(InvariantError);
        });
    });

    describe("addUser", () => {
        it("persists and return registered user correctly", async () => {
            const newUser = {
                username: "dicoding",
                password: "secret_password",
                fullname: "Dicoding Zimbabwe",
            };

            const userDB = buildUserDBPostgres({
                generateId: () => "123",
            });

            const registeredUser = await userDB.addUser(newUser);

            const users = await userDBTest.findUsersById("user-123");
            expect(users).toHaveLength(1);

            expect(registeredUser).toStrictEqual({
                id: "user-123",
                username: newUser.username,
                fullname: newUser.fullname,
            });
        });
    });

    describe("getPasswordByUsername", () => {
        it("throws error if username not found", async () => {
            const userDB = buildUserDBPostgres({
                generateId: {},
            });

            await expect(
                userDB.getPasswordByUsername("wawan")
            ).rejects.toThrowError("username tidak ditemukan");
        });

        it("gets user password by given username", async () => {
            await userDBTest.addUser({ username: "wawan" });

            const userDB = buildUserDBPostgres({
                generateId: {},
            });

            const password = await userDB.getPasswordByUsername("wawan");

            expect(password).toBeDefined();
            expect(typeof password).toEqual("string");
        });
    });

    describe("getIdByUsername", () => {
        it("throws error if username not found", async () => {
            const userDB = buildUserDBPostgres({
                generateId: {},
            });

            await expect(userDB.getIdByUsername("wawan")).rejects.toThrowError(
                "username tidak ditemukan"
            );
        });

        it("gets user id by given username", async () => {
            await userDBTest.addUser({ username: "wawan" });

            const userDB = buildUserDBPostgres({
                generateId: {},
            });

            const userId = await userDB.getIdByUsername("wawan");

            expect(userId).toBeDefined();
            expect(typeof userId).toEqual("string");
        });
    });
});
