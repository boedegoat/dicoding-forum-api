const buildBcryptPasswordHash = require("./bcrypt-passwordHash");
const buildJwtTokenHandler = require("./jwt-tokenHandler");

module.exports = {
    passwordHash: buildBcryptPasswordHash(),
    authTokenHandler: buildJwtTokenHandler(),
};
