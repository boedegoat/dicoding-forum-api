/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable("comments", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        content: {
            type: "TEXT",
            notNull: true,
        },
        thread_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"threads"',
            onDelete: "cascade",
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
    pgm.dropTable("comments");
};
