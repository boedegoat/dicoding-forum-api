const addThreadSchema = {
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

const buildAddThread = ({ buildValidator, threadDB }) => {
    return async (payload) => {
        const validatePayload = buildValidator(addThreadSchema);
        validatePayload(payload);
        return threadDB.addThread(payload);
    };
};

module.exports = buildAddThread;
