const buildAddThread = require("./add-thread");
const buildAddComment = require("./add-comment");
const buildDeleteComment = require("./delete-comment");
const buildGetThread = require("./get-thread");
const buildAddReply = require("./add-reply");
const buildDeleteReply = require("./delete-reply");
const buildLikeComment = require("./like-comment");

module.exports = ({
    buildValidator,
    threadDB,
    commentDB,
    commentLikeDB,
    replyDB,
}) => ({
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
        commentLikeDB,
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

    likeComment: buildLikeComment({
        buildValidator,
        threadDB,
        commentDB,
        commentLikeDB,
    }),
});
