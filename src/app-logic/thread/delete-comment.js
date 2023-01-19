const deleteCommentSchema = {
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

const buildDeleteComment = ({ buildValidator, threadDB, commentDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(deleteCommentSchema);
        const { threadId, commentId, userId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);
        await commentDB.checkIsCommentExistById(commentId);
        await commentDB.verifyCommentAuthorization({ commentId, userId });
        await commentDB.deleteCommentById(commentId);
    };
};

module.exports = buildDeleteComment;
