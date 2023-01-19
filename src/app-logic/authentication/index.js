const buildLoginUser = require("./login-user");
const buildRefreshAuthUser = require("./refreshAuth-user");
const buildLogoutUser = require("./logout-user");

module.exports = ({
    userDB,
    authDB,
    authTokenHandler,
    passwordHash,
    buildValidator,
}) => ({
    loginUser: buildLoginUser({
        buildValidator,
        userDB,
        authDB,
        authTokenHandler,
        passwordHash,
    }),

    refreshAuthUser: buildRefreshAuthUser({
        buildValidator,
        authDB,
        authTokenHandler,
    }),

    logoutUser: buildLogoutUser({
        buildValidator,
        authDB,
    }),
});
