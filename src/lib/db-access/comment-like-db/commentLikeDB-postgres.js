const pool = require("../../db/postgres");
const serializeRow = require("../serializer");

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

    getLikesByCommentIds: async (commentIds) => {
        const query = {
            text: `
                SELECT comment_id, COUNT(*) as like_count FROM comment_likes
                WHERE comment_id = ANY($1::text[])
                GROUP BY comment_id
            `,
            values: [commentIds],
        };

        return (await pool.query(query)).rows.map((row) => {
            const serializedRow = serializeRow(row);
            return {
                ...serializedRow,
                likeCount: Number(serializedRow.likeCount),
            };
        });
    },
});

module.exports = buildCommentLikeDBPostgres;
