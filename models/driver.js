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
      Driver.hasMany(models.Order);
    }
  }
  Driver.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
    rank: {
      type: DataTypes.STRING,
      defaultValue: "Beginner",
      validate: {
        isRegistered(value){
          if (value !== 'Beginner' && value !== 'Rookie' && value !== 'Apprentice' && value !== 'Professional') {
            throw new Error('Driver Rank value is not right!');
          }
        }
      }
    },
    totalPoint: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Driver',
  });

  Driver.afterUpdate((instance, options) => {
    if (instance.totalPoint >= 200) instance.rank = 'Professional'
    else if (instance.totalPoint >= 120) instance.rank = 'Apprentice'
    else if (instance.totalPoint >= 50) instance.rank = 'Rookie'
  });

  return Driver;
};