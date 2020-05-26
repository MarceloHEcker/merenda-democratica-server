import Sequelize, { Model } from 'sequelize';

class File extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				caminho: Sequelize.STRING,
				url: {
					type: Sequelize.VIRTUAL,
					get() {
						return `${process.env.APP_URL}/files/${this.path}`;
					},
				},
			},
			{
				sequelize,
			}
		);

		return this;
	}
}

export default File;
