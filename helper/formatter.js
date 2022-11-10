"use strict";

const formatPhoneNumber = (num) => {
      const arr = num.split("").reverse();
      const newArr = [];

      let temp = "";
      for (const num of arr) {
	if (newArr.length && newArr.length % 4 === 0) {
	  newArr.push(temp);
	  console.log(newArr);
	  temp = "";
	}
	temp += num;
      }
      if (temp.length) newArr.push(temp);

      return newArr.map(el => el.split("").reverse().join("")).reverse().join("-");
}

module.exports = {
  formatPhoneNumber,
}
