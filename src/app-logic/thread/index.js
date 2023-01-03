const { buildAddThread, addThreadSchema } = require("./add-thread");
const { buildAddComment, addCommentSchema } = require("./add-comment");
const { buildDeleteComment, deleteCommentSchema } = require("./delete-comment");
const { buildGetThread, getThreadSchema } = require("./get-thread");
const { buildAddReply, addReplySchema } = require("./add-reply");
const { buildDeleteReply, deleteReplySchema } = require("./delete-reply");

module.exports = ({ buildValidator, threadDB, commentDB, replyDB }) => ({
    addThread: buildAddThread({
        validatePayload: buildValidator(addThreadSchema),
        threadDB,
    }),

    addComment: buildAddComment({
        validatePayload: buildValidator(addCommentSchema),
        threadDB,
        commentDB,
    }),

    deleteComment: buildDeleteComment({
        validatePayload: buildValidator(deleteCommentSchema),
        threadDB,
        commentDB,
    }),

    getThread: buildGetThread({
        validatePayload: buildValidator(getThreadSchema),
        threadDB,
        commentDB,
    }),

    addReply: buildAddReply({
        validatePayload: buildValidator(addReplySchema),
        threadDB,
        commentDB,
        replyDB,
    }),

    deleteReply: buildDeleteReply({
        validatePayload: buildValidator(deleteReplySchema),
        threadDB,
        commentDB,
        replyDB,
    }),
});
