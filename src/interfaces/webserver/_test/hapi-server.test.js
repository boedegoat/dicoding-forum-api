const buildHapiServer = require("../hapi-server");

describe("HTTP Server", () => {
    it("responses 404 if request to not found route", async () => {
        const hapiServer = await buildHapiServer();

        const res = await hapiServer.server.inject({
            method: "/GET",
            url: "/unregistered-route",
        });

        expect(res.statusCode).toEqual(404);
    });

    it("responses 500 if server error occur", async () => {
        const hapiServer = await buildHapiServer();
        const res = await hapiServer.server.inject({
            method: "GET",
            url: "/500-test",
        });

        const resJson = JSON.parse(res.payload);
        expect(res.statusCode).toEqual(500);
        expect(resJson.status).toEqual("error");
        expect(resJson.message).toEqual("terjadi kegagalan pada server kami");
    });

    it("responses json with a message 'Welcome to Forum API' on GET /", async () => {
        const hapiServer = await buildHapiServer();
        const res = await hapiServer.server.inject({
            method: "GET",
            url: "/",
        });

        const resJson = JSON.parse(res.payload);
        expect(resJson.message).toEqual("Welcome to Forum API");
    });

    it("responses json with a value of request user agent on GET /user-agent", async () => {
        const hapiServer = await buildHapiServer();
        const res = await hapiServer.server.inject({
            method: "GET",
            url: "/user-agent",
        });

        const resJson = JSON.parse(res.payload);
        expect(resJson.value).toBeDefined();
        expect(typeof resJson.value).toEqual("string");
        expect(resJson.value.length).not.toEqual(0);
    });

    it("can start the server", async () => {
        const hapiServer = await buildHapiServer({ port: 5050 });
        await expect(hapiServer.start()).resolves.not.toThrowError();
        await hapiServer.end();
    });
});
