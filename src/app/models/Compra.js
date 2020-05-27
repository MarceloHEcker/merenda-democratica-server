import Sequelize, { Model } from 'sequelize';

class Compra extends Model {

	static init(sequelize) {
		super.init(
			{
				ano: Sequelize.NUMBER,
				uf: Sequelize.STRING(2),
				municipio: Sequelize.STRING,
				entidade: Sequelize.STRING,
				numero_dap: Sequelize.STRING,
				organico: Sequelize.STRING(1),
				produto: Sequelize.STRING,
				documento_despesa: Sequelize.STRING,
				unidade_medida: Sequelize.STRING,
				quantidade: Sequelize.FLOAT,
				valor_unitario: Sequelize.FLOAT,
				valor_total: Sequelize.FLOAT,
			},
			{
				sequelize,
			}
		);

		return this;
	}

}

export default Compra;
