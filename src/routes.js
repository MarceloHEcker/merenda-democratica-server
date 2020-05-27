import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UsuarioController from './app/controllers/UsuarioController';
import ArquivoController from './app/controllers/ArquivoController';
import SessionController from './app/controllers/SessionController';
import AvaliacaoController from './app/controllers/AvaliacaoController';
import ComentarioController from './app/controllers/ComentarioController';
import CompraController from './app/controllers/CompraController';

import authMiddleware from './app/middlewares/auth';
import checkAvaliacao from './app/middlewares/checkAvaliacao';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UsuarioController.store);
routes.post('/sessions', SessionController.store);

routes.get('/', (req, res) => res.send('ok'));

routes.use(authMiddleware);

routes.get('/avaliacoes', AvaliacaoController.index);
routes.post('/avaliacoes', AvaliacaoController.store);

routes.get('/comentarios/:avaliacaoId', checkAvaliacao, ComentarioController.index);
routes.post('/comentarios/:avaliacaoId', checkAvaliacao, ComentarioController.store);

routes.get('/compras', CompraController.index);

routes.post('/files', upload.single('file'), ArquivoController.store);

export default routes;
