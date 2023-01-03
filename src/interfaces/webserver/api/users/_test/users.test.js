const userDBTest = require("../../../../../../tests/userDBTest");
const pool = require("../../../../../lib/db/postgres");
const buildHapiServer = require("../../../hapi-server");

describe("/users route", () => {
    beforeEach(async () => {
        await userDBTest.cleanTable();
    });

    afterAll(async () => {
        await userDBTest.cleanTable();
        await pool.end();
    });

    describe("POST /users", () => {
        it("responses 400 if payload not contain needed property", async () => {
            const invalidPayload = {
                username: "samsul",
                password: "samsulganteng123",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
            );
        });

        it("responses 400 if payload not meet data type specs", async () => {
            const invalidPayload = {
                username: "samsul",
                password: "samsulganteng123",
                fullname: true,
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "tidak dapat membuat user baru karena tipe data tidak sesuai"
            );
        });

        it("responses 400 if payload.username is more than 50 characters", async () => {
            const invalidPayload = {
                username: new Array(51).fill("a").join(""),
                password: "samsulganteng123",
                fullname: "Stephen Wawan",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "tidak dapat membuat user baru karena karakter username melebihi batas limit"
            );
        });

        it("responses 400 if payload.username contains restricted characters", async () => {
            const invalidPayload = {
                username: ":==O",
                password: "samsulganteng123",
                fullname: "Stephen Wawan",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual(
                "tidak dapat membuat user baru karena username mengandung karakter terlarang"
            );
        });

        it("responses 400 if payload.username already taken", async () => {
            await userDBTest.addUser({ username: "wawan" });
            const invalidPayload = {
                username: "wawan",
                password: "wawanganteng123",
                fullname: "Stephen Wawan",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload: invalidPayload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(400);
            expect(data.status).toEqual("fail");
            expect(data.message).toEqual("username tidak tersedia");
        });

        it("responses 201 and persist user if payload is correct", async () => {
            const payload = {
                username: "wawan",
                password: "wawanganteng123",
                fullname: "Stephen Wawan",
            };

            const hapiServer = await buildHapiServer();
            const res = await hapiServer.server.inject({
                method: "POST",
                url: "/users",
                payload,
            });

            const data = JSON.parse(res.payload);
            expect(res.statusCode).toEqual(201);
            expect(data.status).toEqual("success");
            expect(data.data.addedUser).toBeDefined();
        });
    });
});
