const buildAuthenticationHandler = require("./handler");
const authRoutes = require("./routes");

module.exports = {
    name: "authentications",
    register: async (server, { authLogic }) => {
        const authHandler = buildAuthenticationHandler({
            authLogic,
        });
        server.route(authRoutes(authHandler));
    },
};
