const loginUserSchema = {
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

const buildLoginUser = ({
    buildValidator,
    userDB,
    authDB,
    authTokenHandler,
    passwordHash,
}) => {
    return async (payload) => {
        const validatePayload = buildValidator(loginUserSchema);
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

module.exports = buildLoginUser;
