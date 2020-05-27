import * as Yup from 'yup';

import Avaliacao from '../models/Avaliacao';

export default async (req, res, next) => {
	const schema = Yup.object().shape({
		avaliacaoId: Yup.string().required(),
	});

	if (!(await schema.isValid(req.params))) {
		return res.status(400).json({ error: 'Erro na validação dos parâmetros' });
	}

	const { avaliacaoId } = req.params;

	const avaliacao = await Avaliacao.findByPk(avaliacaoId);

	if (!avaliacao) {
		console.log('entrou aqui');
		return res.status(400).json({ error: 'Avaliação não encontrada' });
	}

	return next();
};
