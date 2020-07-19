const express = require("express"),
  { sequelize, Paintspace, Films, Genre, Distributor } = require("../database"),
  router = express.Router();
const sqs = require("sequelize-querystring");
const jwt = require("jsonwebtoken");
validatorFilmUpdate = require("../validators/films_update");
const { Op } = require("sequelize");

router.get("/api/test", async (request, response) => {
  console.log(Films);
  console.log("azeaze");
  let films = await Films.findAndCountAll({
    limit: 1000,
    include: [
      {
        model: Genre
      },
      {
        model: Distributor
      }
    ]
  });

  response.json(films);
});

router.get("/api/distributeur", async (request, response) => {
  const givenJwt = request.headers.authorization;
  console.log(givenJwt);

  let distributeur = await Distributor.findAndCountAll({
    limit: 1000,
    where: { id_distributeur: "1" },
    include: [
      {
        model: Films
      }
    ]
  });
  response.json(distributeur);
});

router.get("/films", (request, response) => {
  Genre.findAll().then(genre => {
    console.log(genre[0].nom);
    response.render("films", {
      genreList: genre
    });
  });
});

router.get("/films/all", (request, response) => {
  Films.findAll().then(film => {
    response.json(film);
  });
});

router.get("/api/genre/all", (request, response) => {
  Genre.findAll().then(genre => {
    response.json(genre);
  });
});

router.get("/api/distributeur/all", (request, response) => {
  Distributor.findAll().then(distributeur => {
    response.json(distributeur);
  });
});

router.get("/film/:id(\\d+)", (request, response) => {
  Films.findByPk(request.params.id, {
    include: [
      {
        model: Genre,
        as: "genre"
      },
      {
        model: Distributor
      }
    ]
  })
    .then(film => {
      response.json(film);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/distributor/:id(\\d+)", (request, response) => {
  Distributor.findByPk(request.params.id)
    .then(distrib => {
      response.json(distrib);
    })
    .catch(err => {
      console.log(err);
    });
});

router.put("/api/film/:id(\\d+)", validatorFilmUpdate, (request, response) => {
  console.log("sal");
  Films.findByPk(request.params.id).then(film => {
    console.log(request.body);
    film
      .update({
        titre: request.body.titre || film.titre,
        id_genre: request.body.id_genre || film.genre,
        id_distributeur: request.body.id_distributeur || film.id_distributeur,
        resum: request.body.resum || film.resum,
        duree_minutes: request.body.duree_minutes || film.duree_minutes,
        annee_production:
          request.body.annee_production || film.annee_production,
        date_debut_affiche:
          request.body.date_debut_affiche || film.date_debut_affiche,
        date_fin_affiche: request.body.date_fin_affiche || film.date_fin_affiche
      })
      .then(film => {
        response.json({ film, status: 200 });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.put("/api/distributor/:id(\\d+)", (request, response) => {
  Distributor.findByPk(request.params.id).then(distrib => {
    console.log(request.body);
    distrib
      .update({
        nom: request.body.nom || distrib.nom,
        telephone: request.body.telephone || film.telephone
      })
      .then(distrib => {
        response.json({ distrib, status: 200 });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

router.get("/api/films", async (request, response) => {
  let offset = parseInt(request.query.offset);
  let limit = parseInt(request.query.limit);
  let genre = request.query.genre;
  let distributeur = request.query.distributeur;
  if (distributeur && genre) {
    console.log("ca passe ici");
    query = {
      [Op.and]: [
        { "$genre.nom$": genre },
        { "$distributeur.nom$": distributeur }
      ]
    };
  } else if (distributeur) {
    query = { "$distributeur.nom$": distributeur };
  } else if (genre) {
    query = { "$genre.nom$": genre };
  } else if (!distributeur && !genre) {
    query = null;
  }

  try {
    let films = await Films.findAndCountAll({
      offset: offset,
      limit: limit,
      where: query,
      order: request.query.sort ? sqs.sort(request.query.sort) : [],
      include: [
        {
          model: Genre,
          as: "genre"
        },
        {
          model: Distributor
        }
      ]
    });

    response.json(films);
  } catch (e) {
    console.log(e);
  }
});

router.put("/api/diffused/:id(\\d+)", async (request, response) => {
  try {
    Films.findByPk(request.params.id).then(newfilm => {
      Films.findOne({
        where: {
          is_diffused: 1
        }
      }).then(lastfilm => {
        lastfilm.update({
          is_diffused: 0
        });
      });
      newfilm
        .update({
          is_diffused: 1
        })
        .then(newfilm => {
          response.json({ newfilm, status: 200 });
        })
        .catch(err => {
          response.json({ status: 400, message: "Aucun film n'a été trouvé" });
        });
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/api/diffused", (request, response) => {
  try {
    Films.findOne({
      include: [
        {
          model: Genre,
          as: "genre"
        },
        {
          model: Distributor
        }
      ],
      where: {
        is_diffused: 1
      }
    })
      .then(film => {
        response.json(film);
      })
      .catch(err => {
        response.json({ status: 400 });
      });
  } catch (e) {
    console.log(e);
  }
});

router.delete("/api/film/:id(\\d+)", (request, response) => {
  Films.findByPk(request.params.id)
    .then(film => {
      film.destroy().then(film => {
        response.json(film);
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.delete("/api/distributor/:id(\\d+)", (request, response) => {
  Distributor.findByPk(request.params.id)
    .then(distrib => {
      distrib.destroy().then(distrib => {
        response.json(distrib);
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/api/distributeurs", async (request, response) => {
  console.log(sequelize);
  let offset = parseInt(request.query.offset || 0);
  let limit = parseInt(request.query.limit || 20);
  try {
    let distrib = await Distributor.findAndCountAll({
      offset: offset,
      limit: limit
    });

    response.json(distrib);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
