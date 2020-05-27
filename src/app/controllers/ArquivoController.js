import Arquivo from '../models/Arquivo';

class ArquivoController {
	async store(req, res) {
		const { originalname: nome, filename: caminho } = req.file;

		const file = await Arquivo.create({
			nome,
			caminho,
		});

		return res.json(file);
	}
}

export default new ArquivoController();
