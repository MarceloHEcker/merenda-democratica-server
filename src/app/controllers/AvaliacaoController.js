import * as Yup from 'yup';
import Twit from 'twit';
import axios from 'axios';

import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Usuario from '../models/Usuario';
import Compra from '../models/Compra';
import Avaliacao from '../models/Avaliacao';

class AvaliacaoController {
	async index(req, res) {

		const avaliacoes = await Avaliacao.findAll({
			include: [
				{
					model: Usuario,
					as: 'usuario',
					attributes: ['nome', 'email'],
				},
				{
					model: Compra,
					as: 'compra',
					attributes: ['ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
				}
			],
			order: [
				['created_at', 'DESC']
			],
		});

		return res.json(avaliacoes);
	}

	async indexBad(req, res) {

		const avaliacoes = await Avaliacao.findAll({
			where: {
				status: false,
			},
			include: [
				{
					model: Usuario,
					as: 'usuario',
					attributes: ['nome', 'email'],
				},
				{
					model: Compra,
					as: 'compra',
					attributes: ['ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
				}
			],
			order: [
				['created_at', 'DESC']
			],
		});

		return res.json(avaliacoes);
	}

	async indexByUser(req, res) {

		const avaliacoes = await Avaliacao.findAll({
			where: {
				usuario_id: req.params.usuarioId,
			},
			include: [
				{
					model: Usuario,
					as: 'usuario',
					attributes: ['nome', 'email'],
				},
				{
					model: Compra,
					as: 'compra',
					attributes: ['ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
				}
			],
			order: [
				['created_at', 'DESC']
			],
		});

		return res.json(avaliacoes);
	}

	async store(req, res) {

		const schema = Yup.object().shape({
			status: Yup.boolean().required(),
			compra_id: Yup.number().required(),
			usuario_id: Yup.number().required()
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação' });
		}

		const { compra_id, status, usuario_id } = req.body;

		const avaliacao = await Avaliacao.create({
			usuario_id,
			status,
			compra_id,
		});

		if (!avaliacao.status) {
			const order = await Compra.findByPk(compra_id);

			const T = new Twit({
				consumer_key: '...',
				consumer_secret: '...',
				access_token: '...',
				access_token_secret: '...',
				timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
				strictSSL: true,     // optional - requires SSL certificates to be valid.
			});

			const tweetContent = `Indício de fraude apontado por usuário na compra realizada! De ${order.produto} - ${order.municipio}/${order.uf} efetuada em ${order.year}`;

			T.post('statuses/update', { status: tweetContent }, function (err, data, response) {
				console.log('data from twitter', data);
			});

		}

		return res.json(avaliacao);

	}

}

export default new AvaliacaoController();
