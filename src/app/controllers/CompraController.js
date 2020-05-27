import Compra from '../models/Compra';

import Sequelize from 'sequelize';

import * as Yup from 'yup';

class CompraController {
	async index(req, res) {

		const limit = req.query.limit ? Number(req.query.limit) : 100;
		const page = req.query.page ? Number(req.query.page) : 1;

		const orders = await Compra.findAll({
			limit: limit,
			offset: (page - 1) * limit,
			attributes: ['id', 'ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		return res.json(orders);
	}

	async indexByMunicipio(req, res) {
		const limit = req.query.limit ? Number(req.query.limit) : 100;
		const page = req.query.page ? Number(req.query.page) : 1;

		const schema = Yup.object().shape({
			municipio: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação.' });
		}

		const municipio = String(req.body.municipio).toUpperCase();
		const Op = Sequelize.Op;

		const orders = await Compra.findAll({
			limit: limit,
			where: {
				municipio: {
					[Op.like]: `%${municipio}%`
				}
			},
			offset: (page - 1) * limit,
			attributes: ['id', 'ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		return res.json(orders);
	}

	async random(req, res) {
		const order = await Compra.findOne({
			order: [
				Sequelize.fn('RAND'),
			],
			attributes: ['id', 'ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		return res.json(order);
	}
}

export default new CompraController();
