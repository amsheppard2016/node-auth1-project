const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
    Users.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => res.send(500).json({ message: "you shall not pass" }));
});

module.exports = router;
