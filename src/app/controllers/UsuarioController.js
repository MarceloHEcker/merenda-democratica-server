import * as Yup from 'yup';
import Usuario from '../models/Usuario';
import Arquivo from '../models/Arquivo';

class UsuarioController {

	async store(req, res) {

		const schema = Yup.object().shape({
			nome: Yup.string().required(),
			email: Yup.string()
				.email()
				.required(),
			login: Yup.string()
				.required(),
			password: Yup.string()
				.required()
				.min(6),
			telefone: Yup.string(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação.' });
		}

		const userExists = await Usuario.findOne({ where: { email: req.body.email } });

		if (userExists) {
			return res.status(400).json({ error: 'Usuário já existe.' });
		}

		const { id, name, email } = await Usuario.create(req.body);

		return res.json({
			id,
			nome,
			email,
			login,
			endereco,
			data_nascimento,
			telefone
		});
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			nome: Yup.string(),
			email: Yup.string().email(),
			login: Yup.string(),
			endereco: Yup.string(),
			data_nascimento: Yup.date(),
			senhaAntiga: Yup.string().min(6),
			senha: Yup.string()
				.min(6)
				.when('senhaAntiga', (oldPassword, field) =>
					oldPassword ? field.required() : field
				),
			confirmarSenha: Yup.string().when('senha', (password, field) =>
				password ? field.required().oneOf([Yup.ref('senha')]) : field
			),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Erro na validação' });
		}

		const { email, oldPassword } = req.body;

		const user = await Usuario.findByPk(req.userId);

		if (email !== user.email) {
			const userExists = await Usuario.findOne({ where: { email } });

			if (userExists) {
				return res.status(400).json({ error: 'Usuário já existe' });
			}
		}

		if (oldPassword && !(await user.checkPassword(oldPassword))) {
			return res.status(401).json({ error: 'Senhas não coincidem' });
		}

		await user.update(req.body);

		const { id, nome, email, avatar, endereco, data_nascimento, login, telefone } = await Usuario.findByPk(req.userId, {
			include: [
				{
					model: Arquivo,
					as: 'avatar',
					attributes: ['id', 'caminho', 'url'],
				},
			],
		});

		return res.json({
			id,
			nome,
			email,
			avatar,
			endereco,
			data_nascimento,
			login,
			telefone
		});
	}


}
