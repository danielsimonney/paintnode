const express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser"),
  sha1 = require("sha1"),
  fs = require("fs").promises,
  validatorUserCreate = require("./../validators/users_create"),
  { Op } = require("sequelize"),
  moment = require("moment"),
  jwt = require("jsonwebtoken");

let { User } = require("../database");

router.post("/api/users/login", async (request, response) => {
  console.log(process.env);
  let user = await User.findOne({
    where: {
      email: request.body.email,
      password: sha1(request.body.password)
    }
  });

  if (user) {
    response.json({
      status: 200,
      token: jwt.sign(
        { id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 300 },
        process.env.SECRET
      )
    });
  } else {
    response.json({ status: 400 });
  }
});

router.post("/api/users", validatorUserCreate, (request, response) => {
  console.log(request.body);
  User.create({
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    birth_date: new Date(),
    password: sha1(request.body.password)
  }).then(user => {
    response.json({ status: 201, data: user });
  });
});

router.all("/api/users/:id(\\d+)", (request, response, next) => {
  User.findByPk(request.params.id).then(user => {
    if (user) {
      request.user = user;
      next();
    } else {
      response.status(404).json({ message: "user not found" });
    }
  });
});

router.get("/api/me", (request, response) => {
  response.json(request.user);
});

router.put("/api/users/:id(\\d+)", (request, response) => {
  request.user
    .update({
      firstname: request.body.firstname,
      lastname: request.body.lastname
    })
    .then(user => {
      response.json(user);
    });
});

router.delete("/api/users/:id(\\d+)", (request, response) => {
  request.user.destroy().then(user => {
    response.json(user);
  });
});

module.exports = router;
