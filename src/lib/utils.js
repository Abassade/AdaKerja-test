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

  static generateRandom(length, chars = null) {
    let dict = chars;
    if (!chars) {
      dict = '0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvuwxyz-';
    }
    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  static async authenticateParams(passedJson, neededFields) {
    const missingFields = [];
    neededFields.forEach((element) => {
      if (!passedJson[element]) {
        missingFields.push(element);
      }
    });
    return missingFields;
  }
}
module.exports = Utils;
