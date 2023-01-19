const buildLoginUser = require("../login-user");
const buildValidator = require("../../../lib/validator");

describe("loginUser", () => {
    it("should login user correctly", async () => {
        const payload = {
            username: "agus",
            password: "agusgans",
        };

        const expectedAuth = {
            accessToken: "access-token",
            refreshToken: "refresh-token",
        };

        const mockUserDB = {};
        mockUserDB.getPasswordByUsername = jest.fn(() =>
            Promise.resolve("hashed-password")
        );
        mockUserDB.getIdByUsername = jest.fn(() => Promise.resolve("user-123"));

        const mockAuthDB = {};
        mockAuthDB.addToken = jest.fn(() => Promise.resolve());

        const mockAuthTokenHandler = {};
        mockAuthTokenHandler.createAccessToken = jest.fn(
            () => expectedAuth.accessToken
        );
        mockAuthTokenHandler.createRefreshToken = jest.fn(
            () => expectedAuth.refreshToken
        );

        const mockPasswordHash = {};
        mockPasswordHash.verifyPassword = jest.fn(() => Promise.resolve());

        const loginUser = buildLoginUser({
            buildValidator,
            userDB: mockUserDB,
            authDB: mockAuthDB,
            authTokenHandler: mockAuthTokenHandler,
            passwordHash: mockPasswordHash,
        });

        const actualAuth = await loginUser(payload);

        expect(actualAuth).toEqual(expectedAuth);

        expect(mockUserDB.getPasswordByUsername).toBeCalledWith(
            payload.username
        );
        expect(mockUserDB.getIdByUsername).toBeCalledWith(payload.username);

        expect(mockAuthDB.addToken).toBeCalledWith(expectedAuth.refreshToken);

        expect(mockAuthTokenHandler.createAccessToken).toBeCalledWith({
            username: payload.username,
            id: "user-123",
        });
        expect(mockAuthTokenHandler.createRefreshToken).toBeCalledWith({
            username: payload.username,
            id: "user-123",
        });

        expect(mockPasswordHash.verifyPassword).toBeCalledWith(
            payload.password,
            "hashed-password"
        );
    });
});
