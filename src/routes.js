import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import ArquivoController from './app/controllers/ArquivoController';
import SessionController from './app/controllers/SessionController';
import AvaliacaoController from './app/controllers/AvaliacaoController';
import ComentarioController from './app/controllers/ComentarioController';
import CompraController from './app/controllers/CompraController';
import CompraController from './app/controllers/CompraController';
import PrecoController from './app/controllers/PrecoController';
import PrevisaoController from './app/controllers/PrevisaoController';

import authMiddleware from './app/middlewares/auth';
import checkAvaliacao from './app/middlewares/checkAvaliacao';
import checkCompra from './app/middlewares/checkCompra';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/usarios', UsuarioController.store);
routes.put('/usuarios', UsuarioController.update);

routes.post('/sessions', SessionController.store);

routes.get('/', (req, res) => res.send('ok'));

routes.get('/avaliacoes', AvaliacaoController.index);
routes.get('/avaliacoes/indicio-fraude', AvaliacaoController.indexBad);
routes.post('/avaliacoes', AvaliacaoController.store);
routes.get('/avaliacoes/:usuarioId/usuario', AvaliacaoController.indexByUser);

routes.get('/comentarios/:avaliacaoId', checkAvaliacao, ComentarioController.index);
routes.post('/comentarios', ComentarioController.store);

routes.get('/comentarios/:compraId/compra', checkCompra, ComentarioController.indexByOrder);

routes.get('/compras', CompraController.index);
routes.get('/compras-municipio', CompraController.indexByMunicipio);
routes.get('/compras/random', CompraController.random);
routes.get('/compras/:compraId/municipios-proximos', checkCompra, CompraController.indexMunicipiosProximos);

routes.post('/precos', PrecoController.store);

routes.get('/previsoes', PrevisaoController.index);
routes.post('/previsoes/compra', PrevisaoController.get);

//routes.use(authMiddleware);
routes.post('/files', upload.single('file'), ArquivoController.store);

export default routes;
