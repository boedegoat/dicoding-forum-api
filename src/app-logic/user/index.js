const buildRegisterUser = require("./register-user");

module.exports = ({ userDB, passwordHash, buildValidator }) => ({
    registerUser: buildRegisterUser({
        buildValidator,
        userDB,
        passwordHash,
    }),
});
