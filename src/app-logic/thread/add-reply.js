// TODO: refactor code like add-comment.js

const addReplySchema = {
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

const buildAddReply = ({ buildValidator, threadDB, commentDB, replyDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(addReplySchema);
        validatePayload(payload);
        await threadDB.checkIsThreadExistById(payload.threadId);
        await commentDB.checkIsCommentExistById(payload.commentId);
        return replyDB.addReply(payload);
    };
};

module.exports = buildAddReply;
