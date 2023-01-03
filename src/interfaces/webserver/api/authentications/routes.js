module.exports = (handler) => [
    {
        method: "POST",
        path: "/authentications",
        handler: handler.postAuthenticationsHandler,
    },
    {
        method: "PUT",
        path: "/authentications",
        handler: handler.putAuthenticationsHandler,
    },
    {
        method: "DELETE",
        path: "/authentications",
        handler: handler.deleteAuthenticationsHandler,
    },
];
