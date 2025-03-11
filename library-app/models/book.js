'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {

  }
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "Title"',
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "Author"',
        }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER,
  }, { sequelize });
  return Book;
};