module.exports.registerUserSchema = {
    name: "register_user",
    schema: {
        username: {
            type: "string",
            max: 50,
            regex: /^[\w]+$/,
            required: true,
        },
        fullname: {
            type: "string",
            required: true,
        },
        password: {
            type: "string",
            required: true,
        },
    },
};

module.exports.buildRegisterUser = ({
    validatePayload,
    userDB,
    passwordHash,
}) => {
    return async (payload) => {
        const newUser = validatePayload(payload);
        await userDB.verifyUsername(newUser.username);
        newUser.password = await passwordHash.hash(newUser.password);
        return userDB.addUser(newUser);
    };
};
