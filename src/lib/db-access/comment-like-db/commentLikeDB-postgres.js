const pool = require("../../db/postgres");

const buildCommentLikeDBPostgres = ({ generateId }) => ({
    checkIsUserAlreadyLikedComment: async ({ commentId, userId }) => {
        const query = {
            text: "SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
            values: [commentId, userId],
        };

        const result = (await pool.query(query)).rows[0];
        return Boolean(result);
    },

    likeComment: async ({ commentId, userId }) => {
        const id = `comment-like-${generateId()}`;
        const query = {
            text: "INSERT INTO comment_likes VALUES($1, $2, $3)",
            values: [id, commentId, userId],
        };

        await pool.query(query);
    },

    unlikeComment: async ({ commentId, userId }) => {
        const query = {
            text: "DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
            values: [commentId, userId],
        };

        await pool.query(query);
    },
});

module.exports = buildCommentLikeDBPostgres;
