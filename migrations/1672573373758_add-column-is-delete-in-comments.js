exports.up = (pgm) => {
    pgm.addColumn("comments", {
        is_deleted: {
            type: "bool",
            default: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropCollumn("comments", "is_deleted");
};
