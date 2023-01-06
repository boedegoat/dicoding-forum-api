module.exports.getThreadSchema = {
    name: "get_thread",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildGetThread = ({
    validatePayload,
    threadDB,
    commentDB,
    replyDB,
}) => {
    return async (payload) => {
        const { threadId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);

        const [thread, comments] = await Promise.all([
            threadDB.getThreadById(threadId),
            commentDB.getCommentsByThreadId(threadId),
        ]);

        // attach replies to each comment
        const commentsWithReplies = await Promise.all(
            comments.map(
                async ({ is_deleted: isCommentDeleted, ...comment }) => {
                    let replies = await replyDB.getRepliesByCommentId(
                        comment.id
                    );

                    replies = replies.map(
                        ({ is_deleted: isReplyDeleted, ...reply }) => {
                            if (isReplyDeleted) {
                                return {
                                    ...reply,
                                    content: "**balasan telah dihapus**",
                                };
                            }
                            return reply;
                        }
                    );

                    const newComment = { ...comment };

                    if (replies.length > 0) {
                        newComment.replies = replies;
                    }

                    if (isCommentDeleted) {
                        newComment.content = "**komentar telah dihapus**";
                    }

                    return newComment;
                }
            )
        );

        return {
            ...thread,
            comments: commentsWithReplies,
        };
    };
};
