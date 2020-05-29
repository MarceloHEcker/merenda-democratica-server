
import Sequelize, { Model } from 'sequelize';

class Preco extends Model {

	static init(sequelize) {
		super.init(
			{
				uf: Sequelize.STRING(2),
				municipio: Sequelize.STRING,
				produto: Sequelize.STRING,
				unidade_medida: Sequelize.STRING,
				valor_unitario: Sequelize.FLOAT,
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Arquivo, { foreignKey: 'imagem_id', as: 'imagem' });
	}
}

export default Preco;
