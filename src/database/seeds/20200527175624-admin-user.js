const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          nome: 'Administrador',
          login: 'admin',
          email: 'merendademocratica@gmail.com',
          senha_hash: bcrypt.hashSync('admin', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => { },
};
