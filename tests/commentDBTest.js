/* istanbul ignore file */
const pool = require("../src/lib/db/postgres");

const commentDBTest = {
    async addComment(
        {
            id = "comment-123",
            content = "comment content",
            threadId = "thread-123",
            userId = "user-123",
            isDeleted = false,
        },
        { select = "*" } = {}
    ) {
        const query = {
            text: `
                INSERT INTO comments(id, content, thread_id, owner, is_deleted) 
                VALUES($1, $2, $3, $4, $5) 
                RETURNING ${select}
            `,
            values: [id, content, threadId, userId, isDeleted],
        };

        return (await pool.query(query)).rows[0];
    },

    async findCommentsById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM comments WHERE 1=1");
    },
};

module.exports = commentDBTest;
