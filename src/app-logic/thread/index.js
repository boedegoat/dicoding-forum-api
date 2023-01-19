const buildAddThread = require("./add-thread");
const buildAddComment = require("./add-comment");
const buildDeleteComment = require("./delete-comment");
const buildGetThread = require("./get-thread");
const buildAddReply = require("./add-reply");
const buildDeleteReply = require("./delete-reply");

module.exports = ({ buildValidator, threadDB, commentDB, replyDB }) => ({
    addThread: buildAddThread({
        buildValidator,
        threadDB,
    }),

    addComment: buildAddComment({
        buildValidator,
        threadDB,
        commentDB,
    }),

    deleteComment: buildDeleteComment({
        buildValidator,
        threadDB,
        commentDB,
    }),

    getThread: buildGetThread({
        buildValidator,
        threadDB,
        commentDB,
        replyDB,
    }),

    addReply: buildAddReply({
        buildValidator,
        threadDB,
        commentDB,
        replyDB,
    }),

    deleteReply: buildDeleteReply({
        buildValidator,
        threadDB,
        commentDB,
        replyDB,
    }),
});
