const jwt = require("@hapi/jwt").token;

const InvariantError = require("../../errors/InvariantError");
const buildJwtTokenHandler = require("../jwt-tokenHandler");

describe("jwtTokenHandler", () => {
    describe("createAccessToken", () => {
        it("creates access token correctly", () => {
            const spyGenerate = jest.spyOn(jwt, "generate");
            const jwtTokenHandler = buildJwtTokenHandler();
            const payload = {
                id: "user-100",
                username: "udin",
            };

            const accessToken = jwtTokenHandler.createAccessToken(payload);

            expect(typeof accessToken).toEqual("string");
            expect(accessToken.length).not.toEqual(0);
            expect(spyGenerate).toBeCalledWith(
                payload,
                process.env.ACCESS_TOKEN_KEY
            );
        });
    });

    describe("createRefreshToken", () => {
        it("creates refresh token correctly", () => {
            const spyGenerate = jest.spyOn(jwt, "generate");
            const jwtTokenHandler = buildJwtTokenHandler();
            const payload = {
                id: "user-100",
                username: "udin",
            };

            const refreshToken = jwtTokenHandler.createRefreshToken(payload);

            expect(typeof refreshToken).toEqual("string");
            expect(refreshToken.length).not.toEqual(0);
            expect(spyGenerate).toBeCalledWith(
                payload,
                process.env.REFRESH_TOKEN_KEY
            );
        });
    });

    describe("verifyRefreshToken", () => {
        it("throws invariant error if refresh token is not valid", () => {
            const jwtTokenHandler = buildJwtTokenHandler();
            const invalidRefreshToken = jwtTokenHandler.createAccessToken({
                id: "x",
            });

            expect(() =>
                jwtTokenHandler.verifyRefreshToken(invalidRefreshToken)
            ).toThrowError(InvariantError);
        });

        it("resolves if refresh token is valid", () => {
            const jwtTokenHandler = buildJwtTokenHandler();
            const refreshToken = jwtTokenHandler.createRefreshToken({
                id: "x",
            });

            expect(() =>
                jwtTokenHandler.verifyRefreshToken(refreshToken)
            ).not.toThrowError();
        });
    });

    describe("decodePayload", () => {
        it("decodes payload from refresh token correctly", () => {
            const spyDecode = jest.spyOn(jwt, "decode");
            const jwtTokenHandler = buildJwtTokenHandler();
            const expectedPayload = { id: "user-123" };
            const refreshToken =
                jwtTokenHandler.createRefreshToken(expectedPayload);

            const { id } = jwtTokenHandler.decodePayload(refreshToken);

            expect(id).toEqual(expectedPayload.id);
            expect(spyDecode).toBeCalledWith(refreshToken);
        });
    });
});
