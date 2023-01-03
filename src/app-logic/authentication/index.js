const { buildLoginUser, loginUserSchema } = require("./login-user");
const {
    buildRefreshAuthUser,
    refreshAuthUserSchema,
} = require("./refreshAuth-user");
const { buildLogoutUser, logoutUserSchema } = require("./logout-user");

module.exports = ({
    userDB,
    authDB,
    authTokenHandler,
    passwordHash,
    buildValidator,
}) => ({
    loginUser: buildLoginUser({
        validatePayload: buildValidator(loginUserSchema),
        userDB,
        authDB,
        authTokenHandler,
        passwordHash,
    }),

    refreshAuthUser: buildRefreshAuthUser({
        validatePayload: buildValidator(refreshAuthUserSchema),
        authDB,
        authTokenHandler,
    }),

    logoutUser: buildLogoutUser({
        validatePayload: buildValidator(logoutUserSchema),
        authDB,
    }),
});
