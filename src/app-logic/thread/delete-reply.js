module.exports.deleteReplySchema = {
    name: "delete_reply",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
        commentId: {
            type: "string",
            required: true,
        },
        replyId: {
            type: "string",
            required: true,
        },
        userId: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildDeleteReply = ({
    validatePayload,
    threadDB,
    commentDB,
    replyDB,
}) => {
    return async (payload) => {
        const { threadId, commentId, replyId, userId } =
            validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);
        await commentDB.checkIsCommentExistById(commentId);
        await replyDB.checkIsReplyExistById(replyId);
        await replyDB.verifyReplyAuthorization({
            replyId,
            userId,
        });
        await replyDB.deleteReplyById(replyId);
    };
};
