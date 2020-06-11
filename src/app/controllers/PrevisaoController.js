import Sequelize, { Op } from 'sequelize';
import * as Yup from 'yup';

import Previsao from '../models/Previsao';
import Compra from '../models/Compra';
import TensorService from '../services/TensorService';


class PrevisaoController {

	async index(req, res) {

		const limit = req.query.limit ? Number(req.query.limit) : 100;
		const page = req.query.page ? Number(req.query.page) : 1;

		const previsoes = await Previsao.findAll({
			limit: limit,
			offset: (page - 1) * limit,
			attributes: ['id', 'uf', 'produto', 'quantidade', 'valor_unitario'],
		});

		return res.json(previsoes);
	}

	async get(req, res) {

		const schema = Yup.object().shape({
			uf: Yup.string().required(),
			produto: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação.' });
		}

		const Op = Sequelize.Op;

		const previsoes = await Previsao.findAll({
			where: {
				uf: {
					[Op.like]: `%${req.body.uf}%`
				},
				produto: {
					[Op.like]: `%${req.body.produto}%`
				}
			},
			attributes: ['id', 'uf', 'produto', 'quantidade', 'valor_unitario'],
		});

		return res.json(previsoes);
	}

	async executePreview(req, res) {

		const schema = Yup.object().shape({
			uf: Yup.string().required(),
			produto: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação.' });
		}

		const compras = await Compra.findAll({
			where: {
				uf: {
					[Op.like]: `%${req.body.uf}%`
				},
				produto: {
					[Op.like]: `%${req.body.produto}%`
				}
			},
			attributes: ['id', 'uf', 'produto', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		 // carregando os dados
		 const data = await TensorService.getData(compras);

		 // construindo modelo
		 const model = TensorService.createModel();
	   
		 // convertendo os dados para tensores
		 const tensorData = TensorService.convertToTensor(data);
		 const { inputs, labels } = tensorData;
	   
		 // realizando o treinamento do modelo
		 await TensorService.trainModel(model, inputs, labels);
	   
		 // realizando previsões com o modelo treinado
		 const previews = await TensorService.testModel(model, data, tensorData, req.body.produto, req.body.uf);

		return res.json(previews);
	
	}

	

}

export default new PrevisaoController();
