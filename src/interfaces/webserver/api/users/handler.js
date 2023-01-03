const buildUserHandler = ({ userLogic }) => ({
    postUserHandler: async (request, h) => {
        const addedUser = await userLogic.registerUser(request.payload);
        const res = h.response({
            status: "success",
            data: {
                addedUser,
            },
        });
        res.code(201);
        return res;
    },
});

module.exports = buildUserHandler;
