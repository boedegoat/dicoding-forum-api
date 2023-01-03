module.exports.loginUserSchema = {
    name: "login_user",
    schema: {
        username: {
            type: "string",
            required: true,
        },
        password: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildLoginUser = ({
    validatePayload,
    userDB,
    authDB,
    authTokenHandler,
    passwordHash,
}) => {
    return async (payload) => {
        const { username, password } = validatePayload(payload);

        const hashedPassword = await userDB.getPasswordByUsername(username);
        await passwordHash.verifyPassword(password, hashedPassword);

        const userId = await userDB.getIdByUsername(username);

        const accessToken = authTokenHandler.createAccessToken({
            username,
            id: userId,
        });
        const refreshToken = authTokenHandler.createRefreshToken({
            username,
            id: userId,
        });

        await authDB.addToken(refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    };
};
