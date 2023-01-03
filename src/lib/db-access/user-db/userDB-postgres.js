const pool = require("../../db/postgres");
const InvariantError = require("../../errors/InvariantError");

const buildUserDBPostgres = ({ generateId }) => ({
    verifyUsername: async (username) => {
        const query = {
            text: "SELECT username FROM users WHERE username = $1",
            values: [username],
        };

        const user = (await pool.query(query)).rows[0];

        if (user) {
            throw new InvariantError("username tidak tersedia");
        }
    },

    addUser: async ({ username, fullname, password }) => {
        const id = `user-${generateId()}`;

        const query = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
            values: [id, username, password, fullname],
        };

        return (await pool.query(query)).rows[0];
    },

    getPasswordByUsername: async (username) => {
        const query = {
            text: "SELECT password FROM users WHERE username = $1",
            values: [username],
        };

        const user = (await pool.query(query)).rows[0];

        if (!user) {
            throw new InvariantError("username tidak ditemukan");
        }

        return user.password;
    },

    getIdByUsername: async (username) => {
        const query = {
            text: "SELECT id FROM users WHERE username = $1",
            values: [username],
        };

        const user = (await pool.query(query)).rows[0];

        if (!user) {
            throw new InvariantError("username tidak ditemukan");
        }

        return user.id;
    },
});

module.exports = buildUserDBPostgres;
