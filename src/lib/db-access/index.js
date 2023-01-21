const { nanoid } = require("nanoid");

const buildAuthDBPostgres = require("./auth-db/authDB-postgres");
const buildCommentDBPostgres = require("./comment-db/commentDB-postgres");
const buildThreadDBPostgres = require("./thread-db/threadDB-postgres");
const buildUserDBPostgres = require("./user-db/userDB-postgres");
const buildReplyDBPostgres = require("./reply-db/replyDB-postgres");
const buildCommentLikeDBPostgres = require("./comment-like-db/commentLikeDB-postgres");

module.exports = {
    userDB: buildUserDBPostgres({
        generateId: nanoid,
    }),
    authDB: buildAuthDBPostgres(),
    threadDB: buildThreadDBPostgres({
        generateId: nanoid,
    }),
    commentDB: buildCommentDBPostgres({
        generateId: nanoid,
    }),
    commentLikeDB: buildCommentLikeDBPostgres({
        generateId: nanoid,
    }),
    replyDB: buildReplyDBPostgres({
        generateId: nanoid,
    }),
};
