const { sequelize, User, Board } = require("./../database"),
  express = require("express"),
  router = express.Router(),
  jwt = require("express-jwt");

router.use(
  jwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"]
  }).unless(req => {
    console.log("req");
    return (
      (req.originalUrl === "/api/users/login" && req.method === "POST") ||
      (req.originalUrl === "/api/users" && req.method === "POST")
    );
  })
);

router.use((req, res, next) => {
  if (req.user) {
    User.findByPk(req.user.id).then(user => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

router.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ status: 401, msg: "invalid token..." });
  }
});

module.exports = router;
