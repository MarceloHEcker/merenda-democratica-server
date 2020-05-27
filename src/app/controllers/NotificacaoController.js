import Notificacao from '../schemas/Notificacao';

class NotificacaoController {
	async index(req, res) {

		const notificacoes = await Notificacao.find({
			user: req.userId,
		})
			.sort({ createdAt: 'desc' })
			.limit(20);

		return res.json(notificacoes);
	}

	async update(req, res) {
		const notificacao = await Notificacao.findByIdAndUpdate(
			req.params.id,
			{ read: true },
			{ new: true }
		);

		return res.json(notificacao);
	}
}

export default new NotificacaoController();
