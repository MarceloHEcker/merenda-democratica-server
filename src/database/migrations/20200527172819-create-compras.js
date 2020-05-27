'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('compras', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      uf: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      municipio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entidade: {
        type: Sequelize.STRING
      },
      numero_dap: {
        type: Sequelize.STRING,
      },
      numero_dap: {
        type: Sequelize.STRING,
      },
      organico: {
        type: Sequelize.STRING,
      },
      produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documento_despesa: {
        type: Sequelize.STRING,
      },
      unidade_medida: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      valor_unitario: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      valor_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('compras');
  }
};
