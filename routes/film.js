const express = require("express"),
  { sequelize, Paintspace, Films, Genres } = require("../database"),
  router = express.Router();
const sqs = require("sequelize-querystring");

router.get("/api/test", async (request, response) => {
  let films = await Films.findAndCountAll({
    offset: 0,
    limit: 10,
    where: {
      "$genre.nom$": "comedy"
    },
    include: [
      {
        model: Genres,
        as: "genre"
      }
    ]
  });

  response.json(films);
});

router.get("/films", (request, response) => {
  Genres.findAll().then(genres => {
    console.log(genres[0].nom);
    response.render("films", {
      genreList: genres
    });
  });
});

router.get("/api/films", async (request, response) => {
  console.log(sequelize);
  let offset = parseInt(request.query.offset);
  let limit = parseInt(request.query.limit);
  let genre = request.query.genre;
  console.log(request.query.filter);
  try {
    let films = await Films.findAndCountAll({
      offset: offset,
      limit: limit,
      where: genre ? { "$genre.nom$": genre } : null,
      order: request.query.sort ? sqs.sort(request.query.sort) : [],
      include: [
        {
          model: Genres,
          as: "genre"
        }
      ]
    });

    response.json(films);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
