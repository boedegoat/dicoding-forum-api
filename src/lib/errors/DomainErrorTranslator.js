const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};

DomainErrorTranslator._directories = {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
    ),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
    ),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
    ),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
    ),
    "LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "harus mengirimkan username dan password"
    ),
    "LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "username dan password harus string"
    ),
    "REFRESH_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "harus mengirimkan token refresh"
    ),
    "REFRESH_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION":
        new InvariantError("refresh token harus string"),
    "DELETE_AUTHENTICATION.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "harus mengirimkan token refresh"
    ),
    "DELETE_AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION":
        new InvariantError("refresh token harus string"),
    "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "tidak dapat membuat thread karena property yang dibutuhkan tidak ada"
    ),
    "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "tidak dapat membuat thread karena tipe data tidak sesuai"
    ),
    "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "tidak dapat membuat comment karena property yang dibutuhkan tidak ada"
    ),
    "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "tidak dapat membuat comment karena tipe data tidak sesuai"
    ),
    "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "tidak dapat membuat reply karena property yang dibutuhkan tidak ada"
    ),
    "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "tidak dapat membuat reply karena tipe data tidak sesuai"
    ),
};

module.exports = DomainErrorTranslator;
