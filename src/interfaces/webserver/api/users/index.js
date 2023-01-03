const buildUserHandler = require("./handler");
const userRoutes = require("./routes");

module.exports = {
    name: "users",
    register: async (server, { userLogic }) => {
        const userHandler = buildUserHandler({
            userLogic,
        });
        server.route(userRoutes(userHandler));
    },
};
