const buildHapiServer = require("../hapi-server");

module.exports.getAccessToken = async () => {
    const hapiServer = await buildHapiServer();
    // register user then login to get access token
    const user = {
        username: "udin",
        fullname: "udin aja",
        password: "secret",
    };

    // register user
    await hapiServer.server.inject({
        method: "POST",
        url: "/users",
        payload: user,
    });

    // login user
    const loginRes = await hapiServer.server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
            username: user.username,
            password: user.password,
        },
    });

    const { accessToken } = JSON.parse(loginRes.payload).data;
    return accessToken;
};
