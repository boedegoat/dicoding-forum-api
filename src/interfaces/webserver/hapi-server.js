const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const ClientError = require("../../lib/errors/ClientError");
const DomainErrorTranslator = require("../../lib/errors/DomainErrorTranslator");

const buildValidator = require("../../lib/validator");
const {
    userDB,
    authDB,
    threadDB,
    commentDB,
    replyDB,
    commentLikeDB,
} = require("../../lib/db-access");
const { authTokenHandler, passwordHash } = require("../../lib/security");

const buildUserLogic = require("../../app-logic/user");
const buildAuthLogic = require("../../app-logic/authentication");
const buildThreadLogic = require("../../app-logic/thread");

const buildHapiServer = async ({
    host = process.env.HOST,
    port = process.env.PORT,
} = {}) => {
    const server = Hapi.server({
        host,
        port,
    });

    // register external plugins
    await server.register([{ plugin: Jwt }]);

    // define jwt auth strategy
    server.auth.strategy("forumapi_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    server.route([
        {
            method: "GET",
            path: "/",
            handler: () => ({
                name: "forum-api",
                message: "Welcome to Forum API",
                repository: "https://github.com/boedegoat/dicoding-forum-api",
            }),
        },
        {
            method: "GET",
            path: "/user-agent",
            handler: (request) => ({
                value: request.headers["user-agent"],
            }),
        },
        {
            method: "GET",
            path: "/500-test",
            handler: () => {
                // eslint-disable-next-line no-undef
                console.log(apakek);
            },
        },
    ]);

    await server.register([
        {
            plugin: require("./api/users"),
            options: {
                userLogic: buildUserLogic({
                    buildValidator,
                    userDB,
                    passwordHash,
                }),
            },
        },
        {
            plugin: require("./api/authentications"),
            options: {
                authLogic: buildAuthLogic({
                    buildValidator,
                    userDB,
                    authDB,
                    authTokenHandler,
                    passwordHash,
                }),
            },
        },
        {
            plugin: require("./api/threads"),
            options: {
                threadLogic: buildThreadLogic({
                    buildValidator,
                    threadDB,
                    commentDB,
                    commentLikeDB,
                    replyDB,
                }),
            },
        },
    ]);

    server.ext("onPreResponse", (req, h) => {
        const { response: res } = req;

        if (res instanceof Error) {
            const translatedError = DomainErrorTranslator.translate(res);

            // handles client error
            if (translatedError instanceof ClientError) {
                const errRes = h.response({
                    status: "fail",
                    message: translatedError.message,
                });
                errRes.code(translatedError.statusCode);
                return errRes;
            }

            // keep hapi native errors (404, etc)
            if (!translatedError.isServer) {
                return h.continue;
            }

            // handles server error
            console.log(res.stack);
            const errRes = h.response({
                status: "error",
                message: "terjadi kegagalan pada server kami",
            });
            errRes.code(500);
            return errRes;
        }

        // if not error, continue the response
        return h.continue;
    });

    return {
        server,
        start: async () => {
            await server.start();
            console.log(`Server running on ${server.info.uri}`);
        },
        end: async () => {
            server.stop();
        },
    };
};

module.exports = buildHapiServer;
