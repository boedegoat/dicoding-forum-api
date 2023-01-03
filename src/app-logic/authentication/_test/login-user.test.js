const { buildLoginUser, loginUserSchema } = require("../login-user");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(loginUserSchema);

describe("loginUser", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {
            username: "bob",
        };

        const loginUser = buildLoginUser({
            validatePayload,
            userDB: {},
            authDB: {},
            authTokenHandler: {},
            passwordHash: {},
        });

        await expect(loginUser(invalidPayload)).rejects.toThrowError(
            "LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload doesn't meet data type specification", async () => {
        const invalidPayload = {
            username: "bob",
            password: true,
        };

        const loginUser = buildLoginUser({
            validatePayload,
            userDB: {},
            authDB: {},
            authTokenHandler: {},
            passwordHash: {},
        });

        await expect(loginUser(invalidPayload)).rejects.toThrowError(
            "LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

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
        mockUserDB.getPasswordByUsername = jest
            .fn()
            .mockImplementation(() => Promise.resolve("hashed-password"));
        mockUserDB.getIdByUsername = jest
            .fn()
            .mockImplementation(() => Promise.resolve("user-123"));

        const mockAuthDB = {};
        mockAuthDB.addToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const mockAuthTokenHandler = {};
        mockAuthTokenHandler.createAccessToken = jest
            .fn()
            .mockImplementation(() => expectedAuth.accessToken);
        mockAuthTokenHandler.createRefreshToken = jest
            .fn()
            .mockImplementation(() => expectedAuth.refreshToken);

        const mockPasswordHash = {};
        mockPasswordHash.verifyPassword = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const loginUser = buildLoginUser({
            validatePayload,
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
