import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				email: Sequelize.STRING,
				login: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				endereco: {
					type: Sequelize.STRING,
					defaultValue: ''
				},
				data_nascimento: {
					type: Sequelize.DATE,
					defaultValue: null,
				},
				telefone: Sequelize.STRING,
				senha: Sequelize.VIRTUAL,
				senha_hash: Sequelize.STRING,
			},
			{
				sequelize,
			}
		);

		this.addHook('beforeSave', async usuario => {
			if (usuario.senha) {
				// eslint-disable-next-line no-param-reassign
				user.senha_hash = await bcrypt.hash(usuario.senha, 8);
			}
		});

		return true;
	}

	static associate(models) {
		this.belongsTo(models.Arquivo, { foreignKey: 'avatar_id', as: 'avatar' });
	}

	checkPassword(senha) {
		return bcrypt.compare(senha, this.senha_hash);
	}

}

export default Usuario;
