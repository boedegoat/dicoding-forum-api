const pool = require("../../db/postgres");
const NotFoundError = require("../../errors/NotFoundError");

const buildThreadDBPostgres = ({ generateId }) => ({
    addThread: async ({ title, body, userId }) => {
        const id = `thread-${generateId()}`;

        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
            values: [id, title, body, userId],
        };

        return (await pool.query(query)).rows[0];
    },

    checkIsThreadExistById: async (threadId) => {
        const query = {
            text: "SELECT id FROM threads WHERE id = $1",
            values: [threadId],
        };

        const thread = (await pool.query(query)).rows[0];
        if (!thread) {
            throw new NotFoundError("thread tidak ditemukan");
        }

        return thread.id;
    },

    getThreadDetailsById: async (threadId) => {
        const query = {
            text: `
                SELECT 
                    threads.id,
                    threads.title, 
                    threads.body, 
                    threads.date,
                    users.username
                FROM threads 
                JOIN users
                ON threads.owner = users.id
                WHERE threads.id = $1
            `,
            values: [threadId],
        };

        return (await pool.query(query)).rows[0];
    },
});

module.exports = buildThreadDBPostgres;
