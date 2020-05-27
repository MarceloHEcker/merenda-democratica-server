import Sequelize, { Model } from 'sequelize';

class ComentarioAvaliacao extends Model {

	static init(sequelize) {
		super.init(
			{
				comentario: Sequelize.STRING,
			},
			{
				tableName: 'comentarios',
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Avaliacao, { foreignKey: 'avaliacao_id', as: 'avaliacao' });
	}

}

export default ComentarioAvaliacao;
