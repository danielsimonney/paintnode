const { Sequelize, DataTypes } = require("sequelize");
const { Op } = require("sequelize");
const sequelize = new Sequelize("paint", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: 8889,
  operatorsAliases: Op,
  define: {
    timestamps: false
  }
});
const Paintspace = require("./models/Paintspace")(sequelize, DataTypes);
const Films = require("./models/films")(sequelize, DataTypes);
const Genres = require("./models/genres")(sequelize, DataTypes);

Genres.hasMany(Films);
Films.belongsTo(Genres);

sequelize.sync();

module.exports = {
  sequelize: sequelize,
  Paintspace: Paintspace,
  Films: Films,
  Genres: Genres
};
