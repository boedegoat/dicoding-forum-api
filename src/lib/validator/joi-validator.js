const joi = require("joi");

const buildJoiValidator = ({ name, schema }) => {
    const nameUpperCase = name.toUpperCase();
    const joiSchema = joi
        .object(
            Object.keys(schema).reduce((result, prop) => {
                let newValue = joi;
                const messages = {};

                const types = {
                    string: () => {
                        newValue = newValue.string();

                        if (schema[prop].max) {
                            newValue = newValue.max(schema[prop].max);
                            messages[
                                "string.max"
                            ] = `${nameUpperCase}.${prop.toUpperCase()}_LIMIT_CHAR`;
                        }
                        if (schema[prop].regex) {
                            newValue = newValue.regex(schema[prop].regex);
                            messages[
                                "string.pattern.base"
                            ] = `${nameUpperCase}.${prop.toUpperCase()}_CONTAIN_RESTRICTED_CHARACTER`;
                        }
                    },
                };

                types[schema[prop].type]();

                if (schema[prop].required) {
                    newValue = newValue.required();
                }

                if (Object.keys(messages).length > 0) {
                    newValue = newValue.messages(messages);
                }

                return { ...result, [prop]: newValue };
            }, {})
        )
        .messages({
            "any.required": `${nameUpperCase}.NOT_CONTAIN_NEEDED_PROPERTY`,
            "string.base": `${nameUpperCase}.NOT_MEET_DATA_TYPE_SPECIFICATION`,
        });

    return (payload) => {
        const { error, value } = joiSchema.validate(payload);
        if (error) {
            const message = error.details.map((el) => el.message).join("\n");
            throw new Error(message);
        }

        return value;
    };
};

module.exports = buildJoiValidator;
