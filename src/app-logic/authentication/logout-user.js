module.exports.logoutUserSchema = {
    name: "delete_authentication",
    schema: {
        refreshToken: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildLogoutUser = ({ validatePayload, authDB }) => {
    return async (payload) => {
        const { refreshToken } = validatePayload(payload);
        await authDB.checkIsTokenExist(refreshToken);
        await authDB.deleteToken(refreshToken);
    };
};
