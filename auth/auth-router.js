const router = require("express").Router();
const Users = require("./user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

router.post("/register", async (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;

  try {
    const saved = await Users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", (req, res) => {
  // implement login
});

module.exports = router;
