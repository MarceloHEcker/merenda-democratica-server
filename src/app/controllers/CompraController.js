import Compra from '../models/Compra';

class CompraController {
	async index(req, res) {
		const orders = await Compra.findAll({
			attributes: ['ano', 'uf', 'municipio', 'entidade', 'numero_dap', 'organico', 'produto', 'documento_despesa', 'unidade_medida', 'quantidade', 'valor_unitario', 'valor_total'],
		});

		return res.json(orders);
	}
}

export default new CompraController();
