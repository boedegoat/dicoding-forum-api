require("dotenv").config();

const buildHapiServer = require("./interfaces/webserver/hapi-server");

buildHapiServer().then((hapiServer) => hapiServer.start());
