exports.up = (pgm) => {
    pgm.createTable("threads", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        title: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        body: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"users"',
            onDelete: "cascade",
        },
        date: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("threads");
};
