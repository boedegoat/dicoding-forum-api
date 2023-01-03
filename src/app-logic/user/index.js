const { buildRegisterUser, registerUserSchema } = require("./register-user");

module.exports = ({ userDB, passwordHash, buildValidator }) => ({
    registerUser: buildRegisterUser({
        validatePayload: buildValidator(registerUserSchema),
        userDB,
        passwordHash,
    }),
});
