const getThreadSchema = {
    name: "get_thread",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
    },
};

const buildGetThread = ({
    buildValidator,
    threadDB,
    commentDB,
    commentLikeDB,
    replyDB,
}) => {
    return async (payload) => {
        const validatePayload = buildValidator(getThreadSchema);
        const { threadId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);

        const [thread, comments] = await Promise.all([
            threadDB.getThreadById(threadId),
            commentDB.getCommentsByThreadId(threadId),
        ]);

        const commentIds = getCommentIds(comments);

        const [likes, replies] = await Promise.all([
            commentLikeDB.getLikesByCommentIds(commentIds),
            replyDB.getRepliesByCommentIds(commentIds),
        ]);

        // on each comment...
        thread.comments = comments.map((comment) => {
            const updatedComment = { ...comment };

            // attach like count to current comment
            updatedComment.likeCount = getLikeCount(comment, likes);

            // attach replies to current comment if replies exist
            const repliesInCurrentComment = getReplies(comment, replies);
            if (repliesInCurrentComment.length > 0) {
                updatedComment.replies = repliesInCurrentComment.map((reply) =>
                    serializeReply(reply)
                );
            }

            return serializeComment(updatedComment);
        });

        return thread;
    };
};

module.exports = buildGetThread;

const getCommentIds = (comments) => {
    return comments.map(({ id }) => id);
};

const getLikeCount = (comment, likes) => {
    const likesInCurrentComment = likes.find(
        (like) => like.commentId === comment.id
    );

    return likesInCurrentComment?.likeCount ?? 0;
};

const getReplies = (comment, replies) => {
    const repliesInCurrentComment = replies.filter(
        (reply) => reply.commentId === comment.id
    );

    return repliesInCurrentComment;
};

const serializeComment = (comment) => {
    const { isDeleted, ...restComment } = comment;

    return {
        ...restComment,
        content: isDeleted ? "**komentar telah dihapus**" : restComment.content,
    };
};

const serializeReply = (reply) => {
    const { commentId, isDeleted, ...restReply } = reply;

    return {
        ...restReply,
        content: isDeleted ? "**balasan telah dihapus**" : restReply.content,
    };
};
