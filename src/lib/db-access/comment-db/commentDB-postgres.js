const pool = require("../../db/postgres");
const AuthorizationError = require("../../errors/AuthorizationError");
const NotFoundError = require("../../errors/NotFoundError");
const serializeRow = require("../serializer");

const buildCommentDBPostgres = ({ generateId }) => ({
    addComment: async ({ content, threadId, userId }) => {
        const id = `comment-${generateId()}`;
        const addCommentQuery = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner",
            values: [id, content, threadId, userId],
        };
        return (await pool.query(addCommentQuery)).rows[0];
    },

    checkIsCommentExistById: async (commentId) => {
        const query = {
            text: "SELECT id FROM comments WHERE id = $1",
            values: [commentId],
        };

        const comment = (await pool.query(query)).rows[0];
        if (!comment) {
            throw new NotFoundError("comment tidak ditemukan");
        }
    },

    verifyCommentAuthorization: async ({ commentId, userId }) => {
        const query = {
            text: "SELECT owner FROM comments WHERE id = $1",
            values: [commentId],
        };

        const comment = (await pool.query(query)).rows[0];
        if (comment.owner !== userId) {
            throw new AuthorizationError(
                "anda tidak punya akses di comment ini"
            );
        }
    },

    deleteCommentById: async (commentId) => {
        const softDeleteCommentQuery = {
            text: `
                UPDATE comments 
                SET is_deleted = true
                WHERE id = $1
            `,
            values: [commentId],
        };
        await pool.query(softDeleteCommentQuery);
    },

    getCommentsByThreadId: async (threadId) => {
        const getCommentsQuery = {
            text: `
                SELECT 
                    comments.id,
                    comments.content,
                    comments.date,
                    comments.is_deleted,
                    users.username
                FROM comments
                JOIN users
                ON comments.owner = users.id
                WHERE comments.thread_id = $1
                ORDER BY comments.date
            `,
            values: [threadId],
        };

        return (await pool.query(getCommentsQuery)).rows.map(serializeRow);
    },
});

module.exports = buildCommentDBPostgres;
