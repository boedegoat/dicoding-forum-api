const pool = require("../../db/postgres");
const AuthorizationError = require("../../errors/AuthorizationError");
const NotFoundError = require("../../errors/NotFoundError");

const buildReplyDBPostgres = ({ generateId }) => ({
    addReply: async ({ commentId, content, userId }) => {
        const id = `reply-${generateId()}`;
        const addReplyQuery = {
            text: `
                INSERT INTO replies(id, comment_id, content, owner) 
                VALUES($1, $2, $3, $4)
                RETURNING id, content, owner
            `,
            values: [id, commentId, content, userId],
        };
        return (await pool.query(addReplyQuery)).rows[0];
    },

    checkIsReplyExistById: async (replyId) => {
        const query = {
            text: "SELECT id FROM replies WHERE id = $1",
            values: [replyId],
        };

        const reply = (await pool.query(query)).rows[0];
        if (!reply) {
            throw new NotFoundError("reply tidak ditemukan");
        }

        return reply.id;
    },

    verifyReplyAuthorization: async ({ replyId, userId }) => {
        const query = {
            text: "SELECT owner FROM replies WHERE id = $1",
            values: [replyId],
        };

        const reply = (await pool.query(query)).rows[0];
        if (reply.owner !== userId) {
            throw new AuthorizationError(
                "anda tidak punya akses di balasan ini"
            );
        }
    },

    deleteReplyById: async (replyId) => {
        const softDeleteReplyQuery = {
            text: `
                UPDATE replies 
                SET 
                    is_deleted = true,
                    content = '**balasan telah dihapus**' 
                WHERE id = $1
            `,
            values: [replyId],
        };
        await pool.query(softDeleteReplyQuery);
    },
});

module.exports = buildReplyDBPostgres;
