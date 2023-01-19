const getThreadSchema = {
    name: "get_thread",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
    },
};

const buildGetThread = ({ buildValidator, threadDB, commentDB, replyDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(getThreadSchema);
        const { threadId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);

        const [thread, comments] = await Promise.all([
            threadDB.getThreadById(threadId),
            commentDB.getCommentsByThreadId(threadId),
        ]);

        const commentIds = getCommentIds(comments);
        const replies = await replyDB.getRepliesByCommentIds(commentIds);

        thread.comments = comments.map((comment) =>
            attachRepliesToEachComment(comment, replies)
        );

        return thread;
    };
};

const getCommentIds = (comments) => {
    return comments.map(({ id }) => id);
};

const attachRepliesToEachComment = (comment, replies) => {
    const repliesInCurrentComment = replies.filter(
        (reply) => reply.comment_id === comment.id
    );

    if (repliesInCurrentComment.length === 0) return serializeComment(comment);

    return {
        ...serializeComment(comment),
        replies: repliesInCurrentComment.map((reply) => serializeReply(reply)),
    };
};

const serializeComment = (comment) => {
    const { is_deleted: isDeleted, ...restComment } = comment;

    return {
        ...restComment,
        content: isDeleted ? "**komentar telah dihapus**" : restComment.content,
    };
};

const serializeReply = (reply) => {
    // eslint-disable-next-line camelcase
    const { comment_id, is_deleted: isDeleted, ...restReply } = reply;

    return {
        ...restReply,
        content: isDeleted ? "**balasan telah dihapus**" : restReply.content,
    };
};

module.exports = buildGetThread;
