const { buildLogoutUser, logoutUserSchema } = require("../logout-user");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(logoutUserSchema);

describe("logoutUser", () => {
    it("throws error if payload doesn't contain refresh token", async () => {
        const logoutUser = buildLogoutUser({
            validatePayload,
            authDB: {},
        });

        const payload = {};

        await expect(logoutUser(payload)).rejects.toThrowError(
            "DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if refresh token is not a string", async () => {
        const logoutUser = buildLogoutUser({
            validatePayload,
            authDB: {},
        });

        const payload = {
            refreshToken: 123,
        };

        await expect(logoutUser(payload)).rejects.toThrowError(
            "DELETE_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("logouts user correctly", async () => {
        const mockAuthDB = {};
        mockAuthDB.checkIsTokenExist = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthDB.deleteToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const logoutUser = buildLogoutUser({
            validatePayload,
            authDB: mockAuthDB,
        });

        const payload = {
            refreshToken: "valid-refreshToken",
        };

        await logoutUser(payload);

        expect(mockAuthDB.checkIsTokenExist).toBeCalledWith(
            payload.refreshToken
        );
        expect(mockAuthDB.deleteToken).toBeCalledWith(payload.refreshToken);
    });
});
