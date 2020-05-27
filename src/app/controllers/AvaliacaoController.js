import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Usuario from '../models/Usuario';
import Compra from '../models/Compra';
import Notificacao from '../schemas/Notificacao';

class AvaliacaoController {
	async index(req, res) {

		const avaliacoes = await Compra.findAll({
			where: {
				usuario_id: req.userId,
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
			order: ['date'],
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

		const avaliacao = await Appointment.create({
			usuario_id,
			status,
			compra_id,
			hora_avaliacao: new Date()
		});

		/**
		 * Notificando avaliação realizada
		 */
		const order = await Compra.findByPk(compra_id);
		const hourStart = startOfHour(parseISO(date));
		const formattedDate = format(
			hourStart,
			"'dia' dd 'de' MMMM', às' H:mm'h'",
			{ locale: pt }
		);

		await Notificacao.create({
			content: `Nova avaliação de compra realizada! De ${order.produto} - ${order.municipio}/${order.uf} às ${formattedDate}`,
			user: 1,
		});

		return res.json(avaliacao);

	}

}

export default new AvaliacaoController();
