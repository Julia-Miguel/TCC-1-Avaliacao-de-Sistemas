import { Router } from 'express';
import { GetPublicAvaliacaoByIdController } from '../controller/public/avaliacao/GetPublicAvaliacaoByIdController.js';
import { StartAvaliacaoController } from '../controller/public/avaliacao/StartAvaliacaoController.js';
import { SubmitRespostasController } from '../controller/respostas/SubmitRespostasController.js';

const publicAvaliacaoRoutes = Router();

const getPublicAvaliacaoByIdController = new GetPublicAvaliacaoByIdController();
const startAvaliacaoController = new StartAvaliacaoController();
const submitRespostasController = new SubmitRespostasController();

// Rota para buscar os dados de uma avaliação para responder
publicAvaliacaoRoutes.get('/public/avaliacoes/:avaliacaoId', getPublicAvaliacaoByIdController.handle);

// ✅ NOVA ROTA: Para registrar o início de uma tentativa de resposta
publicAvaliacaoRoutes.post('/public/avaliacoes/:avaliacaoId/iniciar', startAvaliacaoController.handle);

// Rota para submeter as respostas (finalizar)
publicAvaliacaoRoutes.post('/public/avaliacoes/:avaliacaoId/respostas', submitRespostasController.handle);

export { publicAvaliacaoRoutes };
