module.exports.getThreadSchema = {
    name: "get_thread",
    schema: {
        threadId: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildGetThread = ({ validatePayload, threadDB, commentDB }) => {
    return async (payload) => {
        const { threadId } = validatePayload(payload);
        await threadDB.checkIsThreadExistById(threadId);

        const [thread, comments] = await Promise.all([
            threadDB.getThreadDetailsById(threadId),
            commentDB.getCommentsByThreadId(threadId),
        ]);

        return {
            ...thread,
            comments,
        };
    };
};
