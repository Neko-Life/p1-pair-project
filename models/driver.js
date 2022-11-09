'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Driver.belongsTo(models.Item);
      Driver.hasOne(models.User);
      Driver.hasMany(models.History);
    }
  }
  Driver.init({
    name: DataTypes.STRING,
    drivePoint: DataTypes.INTEGER,
    ItemId: {
      type: DataTypes.INTEGER,
      references: {
	model: "Items",
	key: "id"
      }
    },
  }, {
    sequelize,
    modelName: 'Driver',
  });
  return Driver;
};
