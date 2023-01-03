const bcrypt = require("bcrypt");

const AuthenticationError = require("../errors/AuthenticationError");

const buildBcryptPasswordHash = ({ salt = 10 } = {}) => ({
    hash: async (plainPassword) => {
        return bcrypt.hash(plainPassword, salt);
    },

    verifyPassword: async (plainPassword, hashedPassword) => {
        const isCorrect = await bcrypt.compare(plainPassword, hashedPassword);
        if (!isCorrect) {
            throw new AuthenticationError(
                "kredensial yang Anda masukkan salah"
            );
        }
    },
});

module.exports = buildBcryptPasswordHash;
