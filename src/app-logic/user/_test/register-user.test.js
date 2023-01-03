const { buildRegisterUser, registerUserSchema } = require("../register-user");
const buildValidator = require("../../../lib/validator");

const validatePayload = buildValidator(registerUserSchema);

describe("registerUser", () => {
    it("throws error if payload doesn't contain needed property", async () => {
        const invalidPayload = {
            username: "wawan",
            fullname: "Wawan Sinclair",
        };

        const registerUser = buildRegisterUser({
            validatePayload,
            passwordHash: {},
            userDB: {},
        });

        await expect(registerUser(invalidPayload)).rejects.toThrowError(
            "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throws error if payload doesn't meet data type specification", async () => {
        const invalidPayload = {
            username: "wawan",
            fullname: "Wawan Sinclair",
            password: 123456,
        };

        const registerUser = buildRegisterUser({
            validatePayload,
            passwordHash: {},
            userDB: {},
        });

        await expect(registerUser(invalidPayload)).rejects.toThrowError(
            "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("throws error if payload.username contains more than 50 characters", async () => {
        const invalidPayload = {
            username: new Array(51).fill("a").join(""),
            fullname: "Wawan Sinclair",
            password: "wawangans",
        };

        const registerUser = buildRegisterUser({
            validatePayload,
            passwordHash: {},
            userDB: {},
        });

        await expect(registerUser(invalidPayload)).rejects.toThrowError(
            "REGISTER_USER.USERNAME_LIMIT_CHAR"
        );
    });

    it("throws error if payload.username contains restricted characters", async () => {
        const invalidPayload = {
            username: ":==O",
            fullname: "Wawan Sinclair",
            password: "wawangans",
        };

        const registerUser = buildRegisterUser({
            validatePayload,
            passwordHash: {},
            userDB: {},
        });

        await expect(registerUser(invalidPayload)).rejects.toThrowError(
            "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
        );
    });

    it("should register user correctly if given valid payload", async () => {
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
        mockUserDB.verifyUsername = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockUserDB.addUser = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedRegisteredUser));

        const mockPasswordHash = {};
        mockPasswordHash.hash = jest
            .fn()
            .mockImplementation(() => Promise.resolve("hashed-password"));

        const registerUser = buildRegisterUser({
            validatePayload,
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
