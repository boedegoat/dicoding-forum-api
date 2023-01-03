const pool = require("../../db/postgres");
const AuthorizationError = require("../../errors/AuthorizationError");
const NotFoundError = require("../../errors/NotFoundError");

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

        return comment.id;
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
                SET 
                    is_deleted = true,
                    content = '**komentar telah dihapus**' 
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
                    users.username
                FROM comments
                JOIN users
                ON comments.owner = users.id
                WHERE comments.thread_id = $1
                ORDER BY comments.date
            `,
            values: [threadId],
        };

        const comments = (await pool.query(getCommentsQuery)).rows;

        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const getRepliesQuery = {
                    text: `
                    SELECT 
                        replies.id,
                        replies.content,
                        replies.date,
                        users.username
                    FROM replies
                    JOIN users
                    ON replies.owner = users.id
                    WHERE replies.comment_id = $1
                    ORDER BY replies.date
                `,
                    values: [comment.id],
                };
                const replies = (await pool.query(getRepliesQuery)).rows;
                if (replies.length > 0) {
                    return { ...comment, replies };
                }
                return comment;
            })
        );

        return commentsWithReplies;
    },
});

module.exports = buildCommentDBPostgres;
