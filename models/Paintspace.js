module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Paintspace",
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
        get: function() {
          return JSON.parse(this.getDataValue("data"));
        },
        set: function(value) {
          this.setDataValue("data", JSON.stringify(value));
        }
      }
    },
    {}
  );
};
