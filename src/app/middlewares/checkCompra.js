import * as Yup from 'yup';

import Compra  from '../models/Compra';

export default async (req, res, next) => {
	const schema = Yup.object().shape({
		compraId: Yup.number().required(),
	});

	if (!(await schema.isValid(req.params))) {
		return res.status(400).json({ error: 'Erro na validação dos parâmetros' });
	}

	const { compraId } = req.params;

	const compra = await Compra.findByPk(compraId);

	if (!compra) {
		return res.status(400).json({ error: 'Compra não encontrada' });
	}

	return next();
};
