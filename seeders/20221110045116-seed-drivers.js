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
	name: "Aotumatic Kalashnikhov",
	phoneNumber: "0898987458432",
	rank: "Beginner", // total point < 50, Rookie >= 50 < 120, Apprentice >= 120 < 200
	totalPoint: 14,
      },
      {
	name: "Osama Bin MakSud",
	phoneNumber: "0898726456322",
	rank: "Professional", // >= 200
	totalPoint: 230,
      },
    ].map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    return queryInterface.bulkInsert("Drivers", records);
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Drivers");
  }
};
