const likeCommentSchema = {
    name: "like_comment",
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

const buildLikeComment = ({
    buildValidator,
    threadDB,
    commentDB,
    commentLikeDB,
}) => {
    return async (payload) => {
        const validatePayload = buildValidator(likeCommentSchema);
        const { threadId, commentId, userId } = validatePayload(payload);

        await threadDB.checkIsThreadExistById(threadId);
        await commentDB.checkIsCommentExistById(commentId);

        const isUserAlreadyLiked =
            await commentLikeDB.checkIsUserAlreadyLikedComment({
                userId,
                commentId,
            });

        if (!isUserAlreadyLiked) {
            await commentLikeDB.likeComment({
                userId,
                commentId,
            });
        } else {
            await commentLikeDB.unlikeComment({
                userId,
                commentId,
            });
        }
    };
};

module.exports = buildLikeComment;
