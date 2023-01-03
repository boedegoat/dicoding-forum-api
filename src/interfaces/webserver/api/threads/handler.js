const buildThreadHandler = ({ threadLogic }) => ({
    postThreadHandler: async (request, h) => {
        const { id: userId } = request.auth.credentials;
        const addedThread = await threadLogic.addThread({
            ...request.payload,
            userId,
        });
        const res = h.response({
            status: "success",
            data: {
                addedThread,
            },
        });
        res.code(201);
        return res;
    },

    postThreadCommentHandler: async (request, h) => {
        const { id: userId } = request.auth.credentials;
        const { threadId } = request.params;
        const addedComment = await threadLogic.addComment({
            ...request.payload,
            userId,
            threadId,
        });
        const res = h.response({
            status: "success",
            data: {
                addedComment,
            },
        });
        res.code(201);
        return res;
    },

    deleteThreadCommentHandler: async (request, h) => {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        await threadLogic.deleteComment({ threadId, commentId, userId });

        const res = h.response({
            status: "success",
        });
        return res;
    },

    getThreadByIdHandler: async (request, h) => {
        const { threadId } = request.params;
        const thread = await threadLogic.getThread({ threadId });
        const res = h.response({
            status: "success",
            data: {
                thread,
            },
        });
        return res;
    },

    postCommentReplyHandler: async (request, h) => {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const { content } = request.payload;

        const addedReply = await threadLogic.addReply({
            threadId,
            userId,
            commentId,
            content,
        });

        const res = h.response({
            status: "success",
            data: {
                addedReply,
            },
        });
        res.code(201);
        return res;
    },

    deleteCommentReplyHandler: async (request, h) => {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId, replyId } = request.params;

        await threadLogic.deleteReply({
            userId,
            threadId,
            commentId,
            replyId,
        });

        const res = h.response({
            status: "success",
        });
        return res;
    },
});

module.exports = buildThreadHandler;
