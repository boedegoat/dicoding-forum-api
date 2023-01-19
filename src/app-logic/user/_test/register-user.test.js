const buildRegisterUser = require("../register-user");
const buildValidator = require("../../../lib/validator");

describe("registerUser", () => {
    it("registers user correctly", async () => {
        const payload = {
            username: "wawan",
            password: "rahasia",
            fullname: "Wawan Sinclair",
        };

        const expectedRegisteredUser = {
            id: "user-123",
            username: payload.username,
            fullname: payload.fullname,
        };

        const mockUserDB = {};
        mockUserDB.verifyUsername = jest.fn(() => Promise.resolve());
        mockUserDB.addUser = jest.fn(() =>
            Promise.resolve({
                id: "user-123",
                username: payload.username,
                fullname: payload.fullname,
            })
        );

        const mockPasswordHash = {};
        mockPasswordHash.hash = jest.fn(() =>
            Promise.resolve("hashed-password")
        );

        const registerUser = buildRegisterUser({
            buildValidator,
            userDB: mockUserDB,
            passwordHash: mockPasswordHash,
        });

        const registeredUser = await registerUser(payload);

        expect(registeredUser).toStrictEqual(expectedRegisteredUser);
        expect(mockUserDB.verifyUsername).toBeCalledWith(payload.username);
        expect(mockPasswordHash.hash).toBeCalledWith(payload.password);
        expect(mockUserDB.addUser).toBeCalledWith({
            ...payload,
            password: "hashed-password",
        });
    });
});
