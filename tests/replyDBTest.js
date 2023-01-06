/* istanbul ignore file */
const pool = require("../src/lib/db/postgres");

const replyDBTest = {
    async addReply(
        {
            id = "reply-1",
            content = "reply content",
            commentId = "comment-1",
            userId = "user-1",
            isDeleted = false,
        },
        { select = "*" } = {}
    ) {
        const query = {
            text: `
                INSERT INTO replies(id, content, comment_id, owner, is_deleted) 
                VALUES($1, $2, $3, $4, $5) 
                RETURNING ${select}
            `,
            values: [id, content, commentId, userId, isDeleted],
        };

        return (await pool.query(query)).rows[0];
    },

    async findRepliesById(id) {
        const query = {
            text: "SELECT * FROM replies WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM replies WHERE 1=1");
    },
};

module.exports = replyDBTest;
