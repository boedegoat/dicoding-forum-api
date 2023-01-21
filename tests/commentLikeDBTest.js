/* istanbul ignore file */
const pool = require("../src/lib/db/postgres");

const commentLikeDBTest = {
    async addLike({
        id = "comment-like-1",
        commentId = "comment-1",
        userId = "user-1",
    }) {
        const query = {
            text: `
                INSERT INTO comment_likes(id, comment_id, user_id)
                VALUES($1, $2, $3) 
            `,
            values: [id, commentId, userId],
        };

        return (await pool.query(query)).rows[0];
    },

    async findLikesById(id) {
        const query = {
            text: "SELECT * FROM comment_likes WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM comment_likes WHERE 1=1");
    },
};

module.exports = commentLikeDBTest;
