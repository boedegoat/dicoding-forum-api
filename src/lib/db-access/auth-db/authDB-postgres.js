const pool = require("../../db/postgres");
const InvariantError = require("../../errors/InvariantError");

const buildAuthDBPostgres = () => ({
    addToken: async (token) => {
        const query = {
            text: "INSERT INTO authentications VALUES($1)",
            values: [token],
        };

        await pool.query(query);
    },

    checkIsTokenExist: async (token) => {
        const query = {
            text: "SELECT token FROM authentications WHERE token = $1",
            values: [token],
        };

        const tokenInDB = (await pool.query(query)).rows[0];

        if (!tokenInDB) {
            throw new InvariantError(
                "refresh token tidak ditemukan di database"
            );
        }
    },

    deleteToken: async (token) => {
        const query = {
            text: "DELETE FROM authentications WHERE token = $1",
            values: [token],
        };

        await pool.query(query);
    },
});

module.exports = buildAuthDBPostgres;
