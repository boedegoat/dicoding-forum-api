/* istanbul ignore file */

const { Pool } = require("pg");

const testConfig = require("../../../../config/database/test.json");

const pool =
    process.env.NODE_ENV === "production" ? new Pool() : new Pool(testConfig);

module.exports = pool;
