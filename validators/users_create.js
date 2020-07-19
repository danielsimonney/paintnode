const { body, query, validationResult } = require("express-validator");

const { sequelize, User } = require("../database");
// const sqs = require('sequelize-querystring').withSymbolicOps(sequelize)

module.exports = [
  body("firstname")
    .isLength({ min: 2 })
    .withMessage("Votre firstname doit au minimum 2 caractères")
    .isAlpha()
    .withMessage(
      "Votre firstname doit avoir que des caractères alphanumérique"
    ),

  body("lastname")
    .isLength({ min: 2 })
    .withMessage("Votre lastname doit au minimum 2 caractères")
    .isAlpha()
    .withMessage("Votre lastname doit avoir que des caractères alphanumérique"),

  body("email")
    .isEmail()
    .withMessage("Votre email doit être un email")
    .custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.findOne({
          where: {
            email: value
          }
        }).then(user => {
          if (user) {
            reject();
          } else {
            resolve();
          }
        });
      });
    })
    .withMessage("L'email existe déjà en base de données"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Votre password doit au minimum 6 caractères"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  }
];
