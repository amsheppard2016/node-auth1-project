const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try {
        const saved = await Users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await Users.findBy({ username }).first();
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({ message: `welcome${username}` });
        } else {
            res.status(401).json({ message: "invalid creds" });
        }
    } catch (err) {
        res.status(500).json({ message: "you shall not pass" });
    }
});
module.exports = router;
