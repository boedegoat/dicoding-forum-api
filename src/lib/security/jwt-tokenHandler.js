const jwt = require("@hapi/jwt").token;

const InvariantError = require("../errors/InvariantError");

const buildJwtTokenHandler = () => ({
    createAccessToken: (payload) => {
        return jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
    },

    createRefreshToken: (payload) => {
        return jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
    },

    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = jwt.decode(refreshToken);
            jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
        } catch (error) {
            throw new InvariantError("refresh token tidak valid");
        }
    },

    decodePayload: (refreshToken) => {
        const artifacts = jwt.decode(refreshToken);
        return artifacts.decoded.payload;
    },
});

module.exports = buildJwtTokenHandler;
