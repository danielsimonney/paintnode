/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "distributeurs",
    {
      id_distributeur: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "null"
      },
      telephone: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "null"
      }
    },
    {
      tableName: "distributeurs"
    }
  );
};
