module.exports.addThreadSchema = {
    name: "add_thread",
    schema: {
        title: {
            type: "string",
            required: true,
        },
        body: {
            type: "string",
            required: true,
        },
        userId: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildAddThread = ({ validatePayload, threadDB }) => {
    return async (payload) => {
        validatePayload(payload);
        return threadDB.addThread(payload);
    };
};
