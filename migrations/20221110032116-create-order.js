'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      pickupAt: {
        type: Sequelize.STRING
      },
      DriverId: {
        type: Sequelize.INTEGER,
	references: {
	  model: "Drivers",
	  key: "id",
	}
      },
      UserId: {
        type: Sequelize.INTEGER,
	references: {
	  model: "Users",
	  key: "id",
	}
      },
      satisfactionPoint: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Orders');
  }
};
