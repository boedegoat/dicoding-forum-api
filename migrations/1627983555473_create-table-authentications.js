/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable("authentications", {
        token: {
            type: "TEXT",
            notNull: true,
        },
        date: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("authentications");
};
