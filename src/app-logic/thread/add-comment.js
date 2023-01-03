module.exports.addCommentSchema = {
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

module.exports.buildAddComment = ({ validatePayload, threadDB, commentDB }) => {
    return async (payload) => {
        validatePayload(payload);
        await threadDB.checkIsThreadExistById(payload.threadId);
        return commentDB.addComment(payload);
    };
};
