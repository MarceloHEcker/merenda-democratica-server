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
					attributes: ['status', 'created_at'],
				},
			],
			order: ['date'],
		});

		return res.json(comentarios);
	}

	async store(req, res) {

		const schema = Yup.object().shape({
			comentario: Yup.boolean().required(),
			avaliacao_id: Yup.number().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação' });
		}

		const { avaliacao_id, comentario } = req.body;

		const comment = await Appointment.create({
			avaliacao_id,
			comentario,
		});

		return res.json(comment);

	}
}

export default new ComentarioController();
