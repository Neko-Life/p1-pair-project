'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Item);
      History.belongsTo(models.Driver);
      History.belongsTo(models.User);
    }
  }
  History.init({
    UserId: {
      type: DataTypes.INTEGER,
      references: {
	model: "Users",
	key: "id"
      }
    },
    DriverId: {
      type: DataTypes.INTEGER,
      references: {
	model: "Drivers",
	key: "id"
      }
    },
    ItemId: {
      type: DataTypes.INTEGER,
      references: {
	model: "Items",
	key: "id"
      }
    },
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};
