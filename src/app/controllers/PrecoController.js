import Preco from '../models/Preco';

import * as Yup from 'yup';

class PrecoController {
	async store(req, res) {

		const schema = Yup.object().shape({
			uf: Yup.string().required(),
			municipio: Yup.string().required(),
			produto: Yup.string().required(),
			unidade_medida: Yup.string().required(),
			valor_unitario: Yup.number().required()
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação' });
		}

		const { uf, municipio, produto, unidade_medida, valor_unitario } = req.body;

		const preco = await Preco.create({
			uf,
			municipio,
			produto,
			unidade_medida,
			valor_unitario: parseFloat(valor_unitario)
		});

		return res.json(preco);

	}


}

export default new PrecoController();
