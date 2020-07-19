const { body, query, validationResult } = require("express-validator");

const { sequelize, Films, Distributor, Genre } = require("../database");
const moment = require("moment");
// const sqs = require('sequelize-querystring').withSymbolicOps(sequelize)

module.exports = [
  body("resum")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Votre resum doit au minimum 2 caractères")
    .isAscii()
    .withMessage("Votre resum doit avoir que des caractères alphanumérique"),
  body("titre")
    .optional()
    .isAscii("Votre films doit avoir que des caractères alphanumérique")
    .custom((value, { req }) => {
      console.log(req.params.id);
      return new Promise((resolve, reject) => {
        Films.findOne({
          where: {
            titre: value
          }
        }).then(film => {
          if (film) {
            console.log(film.id_film);
            if (film.id_film.toString() === req.params.id) {
              resolve();
            } else {
              reject();
            }
          } else {
            resolve();
          }
        });
      });
    })
    .withMessage("Le film existe déjà en base de donnée"),

  body("date_debut_affiche")
    .optional()
    .isDate()
    .withMessage("Votre date de début d'affiche doit être de format date")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Films.findByPk(req.params.id).then(film => {
          if (req.body.date_fin_affiche) {
            if (moment(value) > moment(req.body.date_fin_affiche)) reject();
          } else {
            if (moment(value) > moment(film.date_fin_affiche)) reject();
          }
          resolve();
        });
      });
    })
    .withMessage(
      "La date de début d'affiche doit être inférieur à la date de fin d'affiche"
    ),

  body("date_fin_affiche")
    .optional()
    .isDate()
    .withMessage("Votre date de fin d'affiche doit être de format date")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Films.findByPk(req.params.id).then(film => {
          if (req.body.date_fin_affiche) {
            if (moment(value) < moment(req.body.date_fin_affiche)) reject();
          } else {
            if (moment(value) < moment(film.date_fin_affiche)) reject();
          }
          resolve();
        });
      });
    })
    .withMessage(
      "La date de fin d'affiche doit être supérieur à la date de début d'affiche"
    ),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  }
];
