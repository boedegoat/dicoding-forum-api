const serializeRow = require("../serializer");

describe("serializer", () => {
    it("serializes row correctly by changing field_name to fieldName", () => {
        const rows = [
            {
                content: "content",
                is_deleted: false,
            },
            {
                content: "content",
                is_deleted: true,
            },
        ];

        const expectedRows = [
            {
                content: "content",
                isDeleted: false,
            },
            {
                content: "content",
                isDeleted: true,
            },
        ];

        const actualRows = rows.map(serializeRow);

        expect(actualRows).toEqual(expectedRows);
    });
});
