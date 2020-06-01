'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('previsoes', 'x', 'valor_unitario');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('previsoes', 'valor_unitario', 'x');
  }
};
