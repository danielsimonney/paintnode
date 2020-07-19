/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "film",
    {
      id_film: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      titre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "null"
      },
      resum: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "null"
      },
      date_debut_affiche: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "null"
      },
      date_fin_affiche: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "null"
      },
      duree_minutes: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        comment: "null"
      },
      annee_production: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        comment: "null"
      },
      is_diffused: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: "null"
      }
    },
    { freezeTableName: true, tableName: "film" }
  );
};
