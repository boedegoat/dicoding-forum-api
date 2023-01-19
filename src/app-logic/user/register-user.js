const registerUserSchema = {
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

const buildRegisterUser = ({ buildValidator, userDB, passwordHash }) => {
    return async (payload) => {
        const validatePayload = buildValidator(registerUserSchema);
        const newUser = validatePayload(payload);
        await userDB.verifyUsername(newUser.username);
        newUser.password = await passwordHash.hash(newUser.password);
        return userDB.addUser(newUser);
    };
};

module.exports = buildRegisterUser;
