'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    const records = [
      {
	      name: "Reva Novaskhra",
	      phoneNumber: "088012213443",
	      rank: "Beginner", // total point < 50, Rookie >= 50 < 120, Apprentice >= 120 < 200
	      totalPoint: 14,
      },
      {
	      name: "Ali Al Ala-Addeen",
	      phoneNumber: "088098897676",
	      rank: "Rookie", //
	      totalPoint: 88,
      },
      {
        name: "Trafalgar Favonia",
	      phoneNumber: "087743431299",
	      rank: "Apprentice", //
	      totalPoint: 123,
      },
      {
        name: "Sir Ius Chrono",
	      phoneNumber: "088843229356",
	      rank: "Rookie", //
	      totalPoint: 90,
      },
      {
        name: "Lee Kang Wu Shuu",
	      phoneNumber: "088723234444",
	      rank: "Beginner", //
	      totalPoint: 11,
      },
      {
        name: "Georgia Prichett",
	      phoneNumber: "088856561234",
	      rank: "Beginner", //
	      totalPoint: 8,
      },
      {
	name: "Burung Onta",
	      phoneNumber: "696969696969",
	      rank: "Professional", //
	      totalPoint: 6969,
      },
    ].map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    return queryInterface.bulkInsert("Drivers", records);
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Drivers");
  }
};
