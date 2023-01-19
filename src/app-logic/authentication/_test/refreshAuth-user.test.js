const buildRefreshAuthUser = require("../refreshAuth-user");
const buildValidator = require("../../../lib/validator");

describe("refreshAuthUser", () => {
    it("refreshes auth correctly", async () => {
        const mockAuthDB = {};
        mockAuthDB.checkIsTokenExist = jest.fn(() => Promise.resolve());

        const mockAuthTokenHandler = {};
        mockAuthTokenHandler.verifyRefreshToken = jest.fn(() => true);
        mockAuthTokenHandler.decodePayload = jest.fn(() => ({
            id: "user-123",
            username: "bjorka",
        }));
        mockAuthTokenHandler.createAccessToken = jest.fn(
            () => "new-accessToken"
        );

        const refreshAuthUser = buildRefreshAuthUser({
            buildValidator,
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
