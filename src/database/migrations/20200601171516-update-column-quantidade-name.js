'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('previsoes', 'y', 'quantidade');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('previsoes', 'quantidade', 'y');
  }
};
