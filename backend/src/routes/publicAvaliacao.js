//backend/src/routes/publicAvaliacao.js
import { Router } from 'express';
import { GetPublicAvaliacaoByIdController } from '../controller/public/avaliacao/GetPublicAvaliacaoByIdController.js';
import { StartAvaliacaoController } from '../controller/public/avaliacao/StartAvaliacaoController.js';
import { SubmitRespostasController } from '../controller/respostas/SubmitRespostasController.js';
import { IdentificarUsuarioController } from '../controller/usuario/IdentificarUsuarioController.js';
import { CheckAvaliacaoController } from '../controller/public/avaliacao/CheckAvaliacaoController.js';

const publicAvaliacaoRoutes = Router();

// Instâncias dos controllers (sem alteração)
const getPublicAvaliacaoByIdController = new GetPublicAvaliacaoByIdController();
const startAvaliacaoController = new StartAvaliacaoController();
const submitRespostasController = new SubmitRespostasController();
const identificarUsuarioController = new IdentificarUsuarioController();
const checkAvaliacaoController = new CheckAvaliacaoController();

// --- ROTAS PÚBLICAS PADRONIZADAS ---

// Rota para o frontend verificar se a avaliação precisa de identificação.
publicAvaliacaoRoutes.get('/public/avaliacoes/:avaliacaoId/check', checkAvaliacaoController.handle);
publicAvaliacaoRoutes.post('/public/usuarios/identificar', identificarUsuarioController.handle);
publicAvaliacaoRoutes.post('/public/avaliacoes/:avaliacaoId/iniciar', startAvaliacaoController.handle);
publicAvaliacaoRoutes.post('/public/avaliacoes/:avaliacaoId/respostas', submitRespostasController.handle);
publicAvaliacaoRoutes.get('/public/avaliacoes/:avaliacaoId', getPublicAvaliacaoByIdController.handle);


export { publicAvaliacaoRoutes };