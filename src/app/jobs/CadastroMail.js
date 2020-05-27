import Mail from '../../lib/Mail';

class CadastroMail {
	get key() {
		return 'CadastroMail';
	}

	async handle({ data }) {
		const { user } = data;

		await Mail.sendMail({
			to: `${user.nome} <${user.email}>`,
			subject: 'Cadastro realizado',
			template: 'cadastro',
			context: {
				userName: user.nome,
				userLogin: user.login,
				userAddress: user.endereco,
				userBirthday: user.data_nascimento,
				userPhone: user.telefone
			},
		});
	}
}

export default new EnrollmentMail();
