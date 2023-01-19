const logoutUserSchema = {
    name: "delete_authentication",
    schema: {
        refreshToken: {
            type: "string",
            required: true,
        },
    },
};

const buildLogoutUser = ({ buildValidator, authDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(logoutUserSchema);
        const { refreshToken } = validatePayload(payload);
        await authDB.checkIsTokenExist(refreshToken);
        await authDB.deleteToken(refreshToken);
    };
};

module.exports = buildLogoutUser;
