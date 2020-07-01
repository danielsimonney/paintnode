const PaintspaceModel = require("./models/Paintspace");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("paint", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: 8889
});

const Paintspace = PaintspaceModel(sequelize, DataTypes);

sequelize.sync();

module.exports = {
  sequelize: sequelize,
  Paintspace: Paintspace
};
