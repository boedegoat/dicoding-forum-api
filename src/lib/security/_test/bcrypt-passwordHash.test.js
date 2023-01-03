const bcrypt = require("bcrypt");

const buildBcryptPasswordHash = require("../bcrypt-passwordHash");

describe("bcryptPasswordHash", () => {
    describe("hash function", () => {
        it("hash password correctly", async () => {
            const spyHash = jest.spyOn(bcrypt, "hash");
            const bcryptPasswordHash = buildBcryptPasswordHash();
            const plainPassword = "plain-password";
            const hashedPassword = await bcryptPasswordHash.hash(plainPassword);

            expect(typeof hashedPassword).toEqual("string");
            expect(hashedPassword).not.toEqual(plainPassword);
            expect(spyHash).toBeCalledWith(plainPassword, 10);
        });
    });
});
