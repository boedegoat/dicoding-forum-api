module.exports.addReplySchema = {
    name: "add_reply",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
        commentId: {
            type: "string",
            required: true,
        },
        userId: {
            type: "string",
            required: true,
        },
        content: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildAddReply = ({
    validatePayload,
    threadDB,
    commentDB,
    replyDB,
}) => {
    return async (payload) => {
        validatePayload(payload);
        await threadDB.checkIsThreadExistById(payload.threadId);
        await commentDB.checkIsCommentExistById(payload.commentId);
        return replyDB.addReply(payload);
    };
};
