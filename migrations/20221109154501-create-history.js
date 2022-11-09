'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
	type: Sequelize.INTEGER,
	references: {
	  model: "Users",
	  key: "id"
	}
      },
      DriverId: {
	type: Sequelize.INTEGER,
	references: {
	  model: "Drivers",
	  key: "id"
	}
      },
      ItemId: {
	type: Sequelize.INTEGER,
	references: {
	  model: "Items",
	  key: "id"
	}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Histories');
  }
};
