import Avaliacao from '../models/Avaliacao';
import Comentario from '../models/Comentario';

class ComentarioController {
	async index(req, res) {

		const comentarios = await Comentario.findAll({
			where: {
				avaliacao_id: req.avaliacaoId,
			},
			include: [
				{
					model: Avaliacao,
					as: 'avaliacao',
					attributes: ['status', 'hora_avaliacao'],
				},
			],
			order: ['date'],
		});

		return res.json(comentarios);
	}

	async store(req, res) {
		return res.json({});
	}
}

export default new ComentarioController();
