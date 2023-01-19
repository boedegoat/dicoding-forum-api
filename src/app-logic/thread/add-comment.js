const addCommentSchema = {
    name: "add_comment",
    schema: {
        content: {
            type: "string",
            required: true,
        },
        threadId: {
            type: "string",
            required: true,
        },
        userId: {
            type: "string",
            required: true,
        },
    },
};

const buildAddComment = ({ buildValidator, threadDB, commentDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(addCommentSchema);
        validatePayload(payload);
        await threadDB.checkIsThreadExistById(payload.threadId);
        return commentDB.addComment(payload);
    };
};

module.exports = buildAddComment;
