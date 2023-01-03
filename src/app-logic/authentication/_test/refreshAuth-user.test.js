const {
    buildRefreshAuthUser,
    refreshAuthUserSchema,
} = require("../refreshAuth-user");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(refreshAuthUserSchema);

describe("refreshAuthUser", () => {
    it("throws error if payload doesn't contain refresh token", async () => {
        const refreshAuthUser = buildRefreshAuthUser({
            validatePayload,
            authDB: {},
            authTokenHandler: {},
        });

        const payload = {};

        await expect(refreshAuthUser(payload)).rejects.toThrowError(
            "REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if refresh token is not a string", async () => {
        const refreshAuthUser = buildRefreshAuthUser({
            validatePayload,
            authDB: {},
            authTokenHandler: {},
        });

        const payload = {
            refreshToken: 123,
        };

        await expect(refreshAuthUser(payload)).rejects.toThrowError(
            "REFRESH_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("refreshes auth correctly", async () => {
        const mockAuthDB = {};
        mockAuthDB.checkIsTokenExist = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const mockAuthTokenHandler = {};
        mockAuthTokenHandler.verifyRefreshToken = jest
            .fn()
            .mockImplementation(() => true);
        mockAuthTokenHandler.decodePayload = jest
            .fn()
            .mockImplementation(() => ({ id: "user-123", username: "bjorka" }));
        mockAuthTokenHandler.createAccessToken = jest
            .fn()
            .mockImplementation(() => "new-accessToken");

        const refreshAuthUser = buildRefreshAuthUser({
            validatePayload,
            authDB: mockAuthDB,
            authTokenHandler: mockAuthTokenHandler,
        });

        const payload = {
            refreshToken: "valid-refreshToken",
        };

        const newAccessToken = await refreshAuthUser(payload);

        expect(mockAuthTokenHandler.verifyRefreshToken).toBeCalledWith(
            payload.refreshToken
        );
        expect(mockAuthDB.checkIsTokenExist).toBeCalledWith(
            payload.refreshToken
        );
        expect(mockAuthTokenHandler.decodePayload).toBeCalledWith(
            payload.refreshToken
        );
        expect(mockAuthTokenHandler.createAccessToken).toBeCalledWith({
            id: "user-123",
            username: "bjorka",
        });
        expect(newAccessToken).toEqual("new-accessToken");
    });
});
