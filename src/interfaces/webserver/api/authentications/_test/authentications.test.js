const userDBTest = require("../../../../../../tests/userDBTest");
const authDBTest = require("../../../../../../tests/authenticationDBTest");
const pool = require("../../../../../lib/db/postgres");
const buildHapiServer = require("../../../hapi-server");
const buildAuthTokenHandler = require("../../../../../lib/security/jwt-tokenHandler");

describe("/authentications route", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
        await authDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await authDBTest.cleanTable();
        await pool.end();
    });

    describe("POST /authentications", () => {
        it("responses 400 if payload not contain needed property", async () => {
            const invalidPayload = {
                username: "samsul",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/authentications",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "harus mengirimkan username dan password"
            );
        });

        it("responses 400 if payload not meet data type specs", async () => {
            const invalidPayload = {
                username: "samsul",
                password: 123,
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/authentications",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("username dan password harus string");
        });

        it("responses 400 if payload.username not found", async () => {
            const payload = {
                username: "Taryo",
                password: "rahasia",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("username tidak ditemukan");
        });

        it("responses 401 if payload.password is wrong", async () => {
            const hapiServer = await buildHapiServer();

            // add user
            await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "udin",
                    fullname: "Udin William",
                    password: "secret",
                },
            });

            const payload = {
                username: "udin",
                password: "wrong-password",
            };

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(401);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("kredensial yang Anda masukkan salah");
        });

        it("responses 201 and logged in user if payload is correct", async () => {
            const hapiServer = await buildHapiServer();

            // add user
            await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "udin",
                    fullname: "Udin William",
                    password: "secret",
                },
            });

            const payload = {
                username: "udin",
                password: "secret",
            };

            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(201);
            expect(data.status).toEqual("success");

            expect(data.data.accessToken).toBeDefined();
            expect(typeof data.data.accessToken).toEqual("string");
            expect(data.data.accessToken.length).not.toEqual(0);

            expect(data.data.refreshToken).toBeDefined();
            expect(typeof data.data.refreshToken).toEqual("string");
            expect(data.data.refreshToken.length).not.toEqual(0);
        });
    });

    describe("PUT /authentications", () => {
        it("responses 400 if payload doesn't contain refresh token", async () => {
            const hapiServer = await buildHapiServer();
            const payload = {};

            const res = await hapiServer.server.inject({
                method: "PUT",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("harus mengirimkan token refresh");
        });

        it("responses 400 if payload.refreshToken is not a string", async () => {
            const hapiServer = await buildHapiServer();
            const payload = {
                refreshToken: 123,
            };

            const res = await hapiServer.server.inject({
                method: "PUT",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("refresh token harus string");
        });

        it("responses 400 if payload.refreshToken is not valid", async () => {
            const hapiServer = await buildHapiServer();
            const authTokenHandler = buildAuthTokenHandler();

            const payload = {
                refreshToken: authTokenHandler.createAccessToken({
                    id: "apakek",
                }),
            };

            const res = await hapiServer.server.inject({
                method: "PUT",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("refresh token tidak valid");
        });

        it("responses 400 if payload.refreshToken is not registered in db", async () => {
            const hapiServer = await buildHapiServer();
            const authTokenHandler = buildAuthTokenHandler();
            const payload = {
                refreshToken: authTokenHandler.createRefreshToken({
                    id: "apakek",
                }),
            };

            const res = await hapiServer.server.inject({
                method: "PUT",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "refresh token tidak ditemukan di database"
            );
        });

        it("responses 200 and returns new access token if payload.refreshToken is valid", async () => {
            const authTokenHandler = buildAuthTokenHandler();
            const refreshToken = authTokenHandler.createRefreshToken({
                id: "apakek",
            });
            await authDBTest.addToken(refreshToken);

            const hapiServer = await buildHapiServer();
            const payload = {
                refreshToken,
            };

            const res = await hapiServer.server.inject({
                method: "PUT",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(200);
            expect(data.status).toEqual("success");

            expect(data.data.accessToken).toBeDefined();
            expect(typeof data.data.accessToken).toEqual("string");
            expect(data.data.accessToken.length).not.toEqual(0);
        });
    });

    describe("DELETE /authentications", () => {
        it("responses 400 if payload doesn't contain refresh token", async () => {
            const hapiServer = await buildHapiServer();
            const payload = {};

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("harus mengirimkan token refresh");
        });

        it("responses 400 if payload.refreshToken is not a string", async () => {
            const hapiServer = await buildHapiServer();
            const payload = {
                refreshToken: 123,
            };

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("refresh token harus string");
        });

        it("responses 400 if payload.refreshToken is not registered in db", async () => {
            const hapiServer = await buildHapiServer();
            const authTokenHandler = buildAuthTokenHandler();
            const payload = {
                refreshToken: authTokenHandler.createRefreshToken({
                    id: "apakek",
                }),
            };

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "refresh token tidak ditemukan di database"
            );
        });

        it("responses 200 if payload.refreshToken is correct and registered in db", async () => {
            const authTokenHandler = buildAuthTokenHandler();
            const refreshToken = authTokenHandler.createRefreshToken({
                id: "apakek",
            });
            await authDBTest.addToken(refreshToken);

            const hapiServer = await buildHapiServer();
            const payload = {
                refreshToken,
            };

            const res = await hapiServer.server.inject({
                method: "DELETE",
                url: "/authentications",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(200);
            expect(data.status).toEqual("success");
        });
    });
});
