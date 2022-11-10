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

    return queryInterface.renameColumn("Profiles", "displayedAddress", "address");
  },

  down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * return queryInterface.dropTable('users');
     */
    return queryInterface.renameColumn("Profiles", "address", "displayedAddress");
  }
};
