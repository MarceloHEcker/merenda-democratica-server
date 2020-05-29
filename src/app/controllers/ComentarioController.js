import * as Yup from 'yup';
import { Op } from 'sequelize';

import Avaliacao from '../models/Avaliacao';
import Comentario from '../models/Comentario';

class ComentarioController {
	async index(req, res) {

		const comentarios = await Comentario.findAll({
			where: {
				avaliacao_id: req.params.avaliacaoId,
			},
			include: [
				{
					model: Avaliacao,
					as: 'avaliacao',
					attributes: ['status', 'created_at'],
				},
			],
			order: ['created_at'],
		});

		return res.json(comentarios);
	}

	async store(req, res) {

		const schema = Yup.object().shape({
			comentario: Yup.string().required(),
			avaliacao_id: Yup.number().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação' });
		}

		const { avaliacao_id, comentario } = req.body;

		const comment = await Comentario.create({
			avaliacao_id,
			comentario,
		});

		return res.json(comment);

	}

	async indexByOrder(req, res) {

		const compra_id = req.params.compraId;

		const avaliacoes = await Avaliacao.findAll({
			where: {
				compra_id,
			},
		});

		const filteredAvaliacoes = avaliacoes.map(item => item.id);

		const comentarios = await Comentario.findAll({
			where: {
				avaliacao_id: {
					[Op.in]: filteredAvaliacoes
				}, 
			},
			order: [
				['created_at', 'DESC'],
			],
		});

		return res.json(comentarios);

	}
}

export default new ComentarioController();
