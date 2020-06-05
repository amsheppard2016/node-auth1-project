const express = require("express");
const session = require("express-session");

const helmet = require("helmet");
const cors = require("cors");
const restricted = require("../auth/restricted-middleware.js");
const knexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
    name: "assession",
    secret: "mysecret",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require("../database/dbconfig.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};

const usersRouter = require("../users/user-router.js");
const authRouter = require("../auth/auth-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api/", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
