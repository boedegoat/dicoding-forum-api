const buildAuthenticationHandler = ({ authLogic }) => ({
    postAuthenticationsHandler: async (request, h) => {
        const token = await authLogic.loginUser(request.payload);
        const res = h.response({
            status: "success",
            data: token,
        });
        res.code(201);
        return res;
    },

    putAuthenticationsHandler: async (request, h) => {
        const newAccessToken = await authLogic.refreshAuthUser(request.payload);
        const res = h.response({
            status: "success",
            data: {
                accessToken: newAccessToken,
            },
        });
        res.code(200);
        return res;
    },

    deleteAuthenticationsHandler: async (request, h) => {
        await authLogic.logoutUser(request.payload);
        const res = h.response({
            status: "success",
        });
        return res;
    },
});

module.exports = buildAuthenticationHandler;
