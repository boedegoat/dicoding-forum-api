const buildJoiValidator = require("../joi-validator");

describe("buildJoiValidator", () => {
    it("throws error if given invalid payload", () => {
        const invalidPayload = {
            username: 123,
            favoriteFood: "indomie",
        };

        const joiValidator = buildJoiValidator({
            name: "test_schema",
            schema: {
                name: {
                    type: "string",
                    required: true,
                },
                favoriteFood: {
                    type: "string",
                },
            },
        });

        expect(() => joiValidator(invalidPayload)).toThrowError();
    });

    it("returns payload values if payload is valid", () => {
        const payload = {
            name: "udin",
        };

        const joiValidator = buildJoiValidator({
            name: "test_schema",
            schema: {
                name: {
                    type: "string",
                    required: true,
                    max: 50,
                    regex: /^[\w]+$/,
                },
                favoriteFood: {
                    type: "string",
                },
            },
        });

        const actualReturn = joiValidator(payload);
        expect(actualReturn).toEqual(payload);
    });
});
