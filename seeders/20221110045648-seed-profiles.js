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
	profileName: "rhona123",
	bio: "hello hello",
	phoneNumber: "09890732489782",
	address: "5th Avenue Under The Sea",
	totalPoint: 9,
	UserId: 1,
      },
      {
	profileName: "ahabert999",
	bio: "The sky is blue as your eyes",
	phoneNumber: "0983458374563",
	address: "23rd Street of Fight",
	totalPoint: 34,
	UserId: 2,
      },
      {
	profileName: "dagal75",
	bio: "In the begining of ... was it a bird? or a plane?",
	phoneNumber: "02342354576456",
	address: "Lumberjack Street of Lizards",
	totalPoint: 66,
	UserId: 3,
      },
      {
	profileName: "vegetables404",
	bio: "What is sleep",
	phoneNumber: "0872344534563534",
	address: "End of Justice Apartment 69 Ohio",
	totalPoint: 123,
	UserId: 4,
      },
    ].map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    return queryInterface.bulkInsert("Profiles", records);
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("Profiles");
  }
};
