module.exports.refreshAuthUserSchema = {
    name: "refresh_authentication",
    schema: {
        refreshToken: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildRefreshAuthUser = ({
    validatePayload,
    authDB,
    authTokenHandler,
}) => {
    return async (payload) => {
        const { refreshToken } = validatePayload(payload);

        authTokenHandler.verifyRefreshToken(refreshToken);
        await authDB.checkIsTokenExist(refreshToken);
        const userPayload = authTokenHandler.decodePayload(refreshToken);
        const newAccessToken = authTokenHandler.createAccessToken(userPayload);

        return newAccessToken;
    };
};
