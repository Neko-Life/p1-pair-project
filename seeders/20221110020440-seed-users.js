'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const records = [
      {
	"username": "Rhona Crauford",
	"email": "rcrauford0@google.com.hk",
	"password": "L300",
	"role": "Regular"
      }, {
	"username": "Ailis Habert",
	"email": "ahabert1@noaa.gov",
	"password": "F250",
	"role": "Silver"
      }, {
	"username": "Daniella Galero",
	"email": "dgalero2@ox.ac.uk",
	"password": "Gallardo",
	"role": "Gold"
      }, {
	"username": "Jacqueline Venables",
	"email": "jvenables2@hatena.ne.jp",
	"password": "S-Series",
	"role": "Platinum"
      }
    ];

    return queryInterface.bulkInsert("Users", records);
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users");
  }
};
