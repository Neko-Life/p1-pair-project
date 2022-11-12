'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);
      Order.belongsTo(models.Driver);
    }
  }
  Order.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      isThere(value) {
        if (value !== "WalkBuroq" && value !== 'WalkRide' && value !== 'WalkCar' && value !== 'WalkTaxi') {
          throw new Error('The inputed Order Type is not registered!');
        }
      }
      }
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    pickupAt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    DriverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    satisfactionPoint: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
