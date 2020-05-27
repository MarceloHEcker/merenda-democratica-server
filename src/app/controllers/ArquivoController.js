import Arquivo from '../models/Arquivo';

class ArquivoController {
	async store(req, res) {
		const { originalname: name, filename: path } = req.file;

		const file = await Arquivo.create({
			name,
			path,
		});

		return res.json(file);
	}
}

export default new ArquivoController();
