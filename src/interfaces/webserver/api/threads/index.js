const buildThreadHandler = require("./handler");
const threadRoutes = require("./routes");

module.exports = {
    name: "threads",
    register: async (server, { threadLogic }) => {
        const threadHandler = buildThreadHandler({
            threadLogic,
        });
        server.route(threadRoutes(threadHandler));
    },
};
