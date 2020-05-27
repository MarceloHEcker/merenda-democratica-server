'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usuarios', 'login', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('usuarios', 'login');
  }
};
