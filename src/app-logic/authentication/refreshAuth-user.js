const refreshAuthUserSchema = {
    name: "refresh_authentication",
    schema: {
        refreshToken: {
            type: "string",
            required: true,
        },
    },
};

const buildRefreshAuthUser = ({ buildValidator, authDB, authTokenHandler }) => {
    return async (payload) => {
        const validatePayload = buildValidator(refreshAuthUserSchema);
        const { refreshToken } = validatePayload(payload);

        authTokenHandler.verifyRefreshToken(refreshToken);
        await authDB.checkIsTokenExist(refreshToken);
        const userPayload = authTokenHandler.decodePayload(refreshToken);
        const newAccessToken = authTokenHandler.createAccessToken(userPayload);

        return newAccessToken;
    };
};

module.exports = buildRefreshAuthUser;
