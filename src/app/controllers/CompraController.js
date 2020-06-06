import Sequelize, { Op } from 'sequelize';
import * as Yup from 'yup';
import axios from 'axios';

import Compra from '../models/Compra';

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
			where: {
				id: 10504
			},
			attributes: ['id', 'ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		return res.json(order);
	}

	async indexMunicipiosProximos(req, res) {

		const compra_id = req.params.compraId;

		const order = await Compra.findByPk(compra_id);

		const municipiosUF = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${order.uf}/municipios`);

		const municipioCompra = municipiosUF.data.filter(item => String(item.nome).toLowerCase() === String(order.municipio).toLowerCase())[0];

		const microrregiaoId = municipioCompra ? municipioCompra.microrregiao.id : -1;

		const municipiosMicrorregiao = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/microrregioes/${microrregiaoId}/municipios`);

		const municipiosArray =
			municipiosMicrorregiao.data.map(item => String(item.nome).toUpperCase()).filter(item => item !== order.municipio);

		const compras = await Compra.findAll({
			where: {
				municipio: {
					[Op.in]: municipiosArray
				},
				produto: order.produto,
				unidade_medida: order.unidade_medida,
			},
			limit: 15,
			order: [
				Sequelize.fn('RAND'),
			],
		});

		return res.json(compras);
	}
}

export default new CompraController();
