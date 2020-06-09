import Sequelize, { Model } from 'sequelize';

class Avaliacao extends Model {

	static init(sequelize) {
		super.init(
			{
				status: Sequelize.BOOLEAN,
			},
			{
				tableName: 'avaliacoes',
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
		this.belongsTo(models.Compra, { foreignKey: 'compra_id', as: 'compra' });
	}

}

export default Avaliacao;
