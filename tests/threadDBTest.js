/* istanbul ignore file */
const pool = require("../src/lib/db/postgres");

const threadDBTest = {
    async addThread(
        {
            id = "thread-123",
            title = "a thread",
            body = "thread body",
            userId = "user-123",
        },
        { select = "*" } = {}
    ) {
        const query = {
            text: `
                INSERT INTO threads
                VALUES($1, $2, $3, $4) 
                RETURNING ${select}
            `,
            values: [id, title, body, userId],
        };

        return (await pool.query(query)).rows[0];
    },

    async findThreadsById(id) {
        const query = {
            text: "SELECT * FROM threads WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM threads WHERE 1=1");
    },
};

module.exports = threadDBTest;
