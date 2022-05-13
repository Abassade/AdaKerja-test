/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const config = require('../config/configuration');
const serviceLocator = require('../config/di');

const logger = serviceLocator.get('logger');

class Utils {
  static isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  static countBirthDays(birthDate){
    const today = new Date();

    const user_year = parseInt(birthDate.substring(0, 4), 10);
    const user_month = parseInt(birthDate.substring(5, 7), 10);
    const user_day = parseInt(birthDate.substring(8, 10), 10);

    if(user_year >= today.getFullYear() || user_month > 12 || user_day > 31){
        return -1;
    }
    else{ 
        const oneDay = 24 * 60 * 60 * 1000;
        const days_left = Math.round(Math.abs( ( (today - new Date(today.getFullYear(), user_month - 1, user_day)) / oneDay) ) );

        return days_left;
    }
  }
}
module.exports = Utils;
