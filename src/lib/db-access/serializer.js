const serializeRow = (row) => {
    const serializedRow = {};
    Object.entries(row).forEach(([field, value]) => {
        // change field_name to fieldName
        const newField = field.replace(/([_][a-z])/g, (group) =>
            group.toUpperCase().replace("_", "")
        );
        serializedRow[newField] = value;
    });
    return serializedRow;
};

module.exports = serializeRow;
