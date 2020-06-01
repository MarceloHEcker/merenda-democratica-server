
import Sequelize, { Model } from 'sequelize';

class Previsao extends Model {

	static init(sequelize) {
		super.init(
			{
				uf: Sequelize.STRING(2),
				produto: Sequelize.STRING,
				quantidade: Sequelize.FLOAT,
				valor_unitario: Sequelize.FLOAT,
			},
			{
				tableName: 'previsoes',
				sequelize,
			}
		);

		return this;
	}
}

export default Previsao;
