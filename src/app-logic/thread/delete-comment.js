module.exports.deleteCommentSchema = {
    name: "delete_comment",
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
    },
};

module.exports.buildDeleteComment = ({
    validatePayload,
    threadDB,
    commentDB,
}) => {
    return async (payload) => {
        const { threadId, commentId, userId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);
        await commentDB.checkIsCommentExistById(commentId);
        await commentDB.verifyCommentAuthorization({ commentId, userId });
        await commentDB.deleteCommentById(commentId);
    };
};
