import Sequelize, { Model } from 'sequelize';

class Avaliacao extends Model {

	static init(sequelize) {
		super.init(
			{
				status: Sequelize.BOOLEAN,
				horaAvaliacao: Sequelize.DATE,
				flag: Sequelize.STRING,
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Compra, { foreignKey: 'compra_id', as: 'compra' });
		this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
	}

}

export default Avaliacao;
