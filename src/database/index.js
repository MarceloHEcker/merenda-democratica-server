import Sequelize from 'sequelize';

import Usuario from '../app/models/Usuario';
import Arquivo from '../app/models/Arquivo';
import Avaliacao from '../app/models/Avaliacao';
import Comentario from '../app/models/Comentario';
import Compra from '../app/models/Compra';
import Preco from '../app/models/Preco';
import Previsao from '../app/models/Previsao';

import databaseConfig from '../config/database';

const models = [Usuario, Arquivo, Avaliacao, Comentario, Compra, Preco, Previsao];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);

		models.map(model => model.init(this.connection));

		models.map(
			model => model.associate && model.associate(this.connection.models)
		);
	}


	mongo() {
		this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useFindAndModify: true,
		});
	}
}

export default new Database();
