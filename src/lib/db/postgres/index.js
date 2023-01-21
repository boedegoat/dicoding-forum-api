/* istanbul ignore file */
const { Pool } = require("pg");

const testOnlyConfig = require("../../../../config/database/test.json");

const { NODE_ENV } = process.env;

const pool = NODE_ENV === "test" ? new Pool(testOnlyConfig) : new Pool();

module.exports = pool;
