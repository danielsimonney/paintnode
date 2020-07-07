const express = require("express"),
  { sequelize, Paintspace, Films, Genres } = require("../database"),
  router = express.Router();
const sqs = require("sequelize-querystring").withSymbolicOps(sequelize);

router.get("/", (request, response) => {
  response.render("index", {
    choice: request.query.choice || undefined,
    error: request.query.error || undefined
  });
});

router.get("/choice/new/", (request, response) => {
  response.redirect("/?choice=newpad");
});

router.get("/choice/join/", (request, response) => {
  response.redirect("/?choice=join");
});

router.get("/pad/:id(\\d+)", (request, response) => {
  Paintspace.findByPk(request.params.id).then(paint => {
    if (request.session.padAuth.includes(paint.id)) {
      response.render("home", {
        name: "Juan",
        bugs: {
          status: "OPEN"
        },
        width: paint.width,
        data: JSON.parse(paint.data),
        idpad: paint.id
      });
    } else {
      response.redirect("/?error=accessungranted");
    }
  });
});

router.post("/join", (request, response) => {
  Paintspace.findOne({
    where: {
      password: request.body.name
    }
  }).then(paint => {
    if (paint) {
      request.session.padAuth.push(paint.id);
      response.redirect("/pad/" + paint.id);
    } else {
      response.redirect("/?error=falsepass");
    }
  });
});

router.post("/pad", (request, response) => {
  const firstFunction = () => {
    data = {};
    for (let i = 1; i <= request.body.width; i++) {
      for (let j = 1; j <= request.body.width; j++) {
        data[i + ";" + j] = "#FFFFFF";
      }
    }
    return JSON.stringify(data);
  };
  const secondFunction = async () => {
    const result = await firstFunction();
    Paintspace.create({
      width: request.body.width,
      password: request.body.name,
      data: result
    })
      .then(paint => {
        request.session.padAuth.push(paint.id);
        response.redirect("/pad/" + paint.id);
      })
      .catch(err => {
        console.log(err);
      });
    // do something else here after firstFunction completes
  };
  secondFunction();
});

module.exports = router;
