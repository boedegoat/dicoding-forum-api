const likeCommentSchema = {
    name: "like_comment",
    schema: {
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

const buildLikeComment = ({ buildValidator, commentDB, commentLikesDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(likeCommentSchema);
        const { commentId, userId } = validatePayload(payload);

        await commentDB.checkIsCommentExistById(commentId);
        const isUserAlreadyLiked =
            await commentLikesDB.checkIsUserAlreadyLikedComment({
                userId,
                commentId,
            });

        if (!isUserAlreadyLiked) {
            await commentLikesDB.likeComment({
                userId,
                commentId,
            });
        } else {
            await commentLikesDB.unlikeComment({
                userId,
                commentId,
            });
        }
    };
};

module.exports = buildLikeComment;
