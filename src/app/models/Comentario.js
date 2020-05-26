import Sequelize, { Model } from 'sequelize';

class ComentarioAvaliacao extends Model {

	static init(sequelize) {
		super.init(
			{
				comentario: Sequelize.STRING,
				horaComentario: Sequelize.DATE,
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.Compra, { foreignKey: 'avaliacao_id', as: 'avaliacao' });
		this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'autor' });
	}

}

export default Avaliacao;
