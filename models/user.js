'use strict';
const {
  Model
} = require('sequelize');

const { hashSync, genSaltSync } = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static validPassword(body) {
      if (!body.password) return false;
      return body.password === body.repeatPassword;
    }

    hashPassword() {
      if (!this.hashed) {
	const salt = genSaltSync(13);
	this.password = hashSync(this.password, salt);
	this.hashed = true;
      }
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
	match(value) {
	  if (!value || value.match(/[^a-z0-9_-]/)?.length) {
	    throw new Error("username can only consist of lowercase letter, underscore, minus, and/or number");
	  }
	},
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
	notEmpty: true,
	notNull: true,
	isEmail: {
	  msg: "please enter a valid email"
	}
      }
    },
    password:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	notEmpty: true,
	notNull: true,
	minLength(value) {
	  if (!value || value.length < 6) {
	    throw new Error("password must be minimum 6 letter long");
	  }
	},
      }
    },
    role:  {
      type: DataTypes.STRING,
      defaultValue: "Regular",
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance, options) => {
    console.log(instance, "<<<<<< SINGLE")
    instance.hashPassword();
  });

  User.beforeBulkCreate((instances, options) => {
    console.log(instances, "<<<<<< BULK");
    instances.forEach(instance => instance.hashPassword());
  });

  return User;
};
