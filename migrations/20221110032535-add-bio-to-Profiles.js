'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * return queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.addColumn("Profiles", "bio", {
      type: Sequelize.STRING
    });
  },

  down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * return queryInterface.dropTable('users');
     */

    return queryInterface.removeColumn("Profiles", "bio");
  }
};
