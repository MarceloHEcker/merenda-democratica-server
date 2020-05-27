import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Usuario from '../models/Usuario';
import Arquivo from '../models/Arquivo';
import authConfig from '../../config/auth';

class SessionController {
	async store(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string()
				.email()
				.required(),
			senha: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Validation fails' });
		}

		const { email, senha } = req.body;

		const user = await Usuario.findOne({
			where: { email },
			include: [
				{
					model: Arquivo,
					as: 'avatar',
					attributes: ['id', 'caminho', 'url'],
				},
			],
		});

		if (!user) {
			return res.status(401).json({ error: 'Usuário não encontrado' });
		}

		if (!(await user.checkPassword(senha))) {
			return res.status(401).json({ error: 'Senha incorreta' });
		}

		const { id, nome, avatar, endereco, data_nascimento, login, telefone } = user;

		return res.json({
			user: {
				id,
				nome,
				email,
				avatar,
				endereco,
				data_nascimento,
				login,
				telefone
			},
			token: jwt.sign({ id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

export default new SessionController();
