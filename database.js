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
const Films = require("./models/Film")(sequelize, DataTypes);
const Genre = require("./models/Genre")(sequelize, DataTypes);
const User = require("./models/User")(sequelize, DataTypes);
const Distributor = require("./models/Distributor")(sequelize, DataTypes);

Genre.hasMany(Films, {
  foreignKey: {
    name: "id_genre",
    allowNull: true
  }
});
Films.belongsTo(Genre, {
  foreignKey: {
    name: "id_genre",
    allowNull: true
  }
});
Distributor.hasMany(Films, {
  foreignKey: {
    name: "id_distributeur",
    allowNull: true
  }
});
Films.belongsTo(Distributor, {
  foreignKey: {
    name: "id_distributeur",
    allowNull: true
  }
});

module.exports = {
  sequelize: sequelize,
  Paintspace: Paintspace,
  Films: Films,
  Genre: Genre,
  User: User,
  Distributor: Distributor
};
