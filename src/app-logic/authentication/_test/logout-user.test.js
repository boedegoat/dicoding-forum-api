const buildLogoutUser = require("../logout-user");
const buildValidator = require("../../../lib/validator");

describe("logoutUser", () => {
    it("logouts user correctly", async () => {
        const mockAuthDB = {};
        mockAuthDB.checkIsTokenExist = jest.fn(() => Promise.resolve());
        mockAuthDB.deleteToken = jest.fn(() => Promise.resolve());

        const logoutUser = buildLogoutUser({
            buildValidator,
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
