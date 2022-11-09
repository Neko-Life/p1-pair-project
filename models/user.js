'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Driver);
      User.hasMany(models.History);
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    totalTransaction: DataTypes.INTEGER,
    DriverId: {
      type: DataTypes.INTEGER,
      references: {
	model: "Drivers",
	key: "id"
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
