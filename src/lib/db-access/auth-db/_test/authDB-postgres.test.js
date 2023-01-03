const buildAuthDBPostgres = require("../authDB-postgres");
const authDBTest = require("../../../../../tests/authenticationDBTest");
const pool = require("../../../db/postgres");
const InvariantError = require("../../../errors/InvariantError");

describe("authDBPostgres", () => {
    beforeEach(async () => {
        await authDBTest.cleanTable();
    });

    afterAll(async () => {
        await authDBTest.cleanTable();
        await pool.end();
    });

    describe("addToken", () => {
        it("adds token to database", async () => {
            const token = "token";
            const authDB = buildAuthDBPostgres();

            await authDB.addToken(token);

            const tokens = await authDBTest.findToken(token);
            expect(tokens).toHaveLength(1);
            expect(tokens[0].token).toEqual(token);
        });
    });

    describe("checkIsTokenExist", () => {
        it("throws invariant error if token is not exist", async () => {
            const authDB = buildAuthDBPostgres();
            const token = "token";

            await expect(authDB.checkIsTokenExist(token)).rejects.toThrowError(
                InvariantError
            );
        });

        it("resolves if token exist", async () => {
            const token = "token";
            await authDBTest.addToken(token);

            const authDB = buildAuthDBPostgres();

            await expect(authDB.checkIsTokenExist(token)).resolves;
        });
    });

    describe("deleteToken", () => {
        it("deletes refresh token from database", async () => {
            const token = "token";
            await authDBTest.addToken(token);

            const authDB = buildAuthDBPostgres();

            await authDB.deleteToken(token);

            const tokens = await authDBTest.findToken(token);
            expect(tokens.length).toEqual(0);
        });
    });
});
