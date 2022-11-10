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

    get formattedPhoneNumber() {
      const arr = this.phoneNumber.split("").reverse();
      const newArr = [];

      let temp = "";
      for (const num of arr) {
	if (newArr.length && newArr.length % 4 === 0) {
	  newArr.push(temp);
	  temp = "";
	}
	temp += num;
      }
      if (temp.length) newArr.push(temp);

      return newArr.map(el => el.split("").reverse().join("")).reverse().join("-");
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
	  value = !value?.length ? "" : value.replace(/[\s-\_]*/g, "");
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
