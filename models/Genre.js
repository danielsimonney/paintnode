/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "genre",
    {
      id_genre: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "null"
      }
    },
    {
      freezeTableName: true,
      tableName: "genre"
    }
  );
};
