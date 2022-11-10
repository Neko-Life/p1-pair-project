'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    profileName: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
	notEmpty: true,
	notNull: true,
	match(value) {
	  if (!value || !value.match(/^\+?\d+$/)?.length) {
	    throw new Error("please enter a valid phone number");
	  }
	},
      }
    },
    address: DataTypes.STRING,
    totalPoint: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bio: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};
