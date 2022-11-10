'use strict';
const {
  Model
} = require('sequelize');
const { formatPhoneNumber } = require("../helper/formatter");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
    }

    get formattedPhoneNumber() {
      return formatPhoneNumber(this.phoneNumber);
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
	  if (!value || !value.replace(/[\s-\_]*/g, "").match(/^\+?\d+$/)?.length) {
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

  Profile.beforeCreate((instance, options) => {
    instance.phoneNumber = instance.phoneNumber.replace(/[\s-\_]*/g, "");
  });

  Profile.beforeBulkCreate((instances, options) => {
    instances.forEach(instance => {
      instance.phoneNumber = instance.phoneNumber.replace(/[\s-\_]*/g, "");
    });
  });

  Profile.beforeUpdate((instance, options) => {
    instance.phoneNumber = instance.phoneNumber.replace(/[\s-\_]*/g, "");
  });

  Profile.beforeBulkUpdate((instances, options) => {
    instances.forEach(instance => {
      instance.phoneNumber = instance.phoneNumber.replace(/[\s-\_]*/g, "");
    });
  });

  // Profile.afterUpdate((instance, options) => {
  //   if (instance.totalPoint >= 100){
  //     this.association.OtherModel.target.update({role:"Platinum"})
  //   } else if (instance.totalPoint >= 50) {
  //     this.association.OtherModel.target.update({role:"Gold"})
  //   } else if (instance.totalPoint >= 20){
  //     this.association.OtherModel.target.update({role:"Silver"})
  //   }
  // })
  return Profile;
};
