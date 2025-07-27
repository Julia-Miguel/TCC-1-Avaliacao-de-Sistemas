import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CreateAvaliacaoController } from '../controller/avaliacao/CreateAvaliacaoController.js';
import { GetAllAvaliacaoController } from '../controller/avaliacao/GetAllAvaliacaoController.js';
import { GetByIdAvaliacaoController } from '../controller/avaliacao/GetByIdAvaliacaoController.js';
import { UpdateAvaliacaoController } from '../controller/avaliacao/UpdateAvaliacaoController.js';
import { DeleteAvaliacaoController } from '../controller/avaliacao/DeleteAvaliacaoController.js';

const avaliacaoRouter = Router();

const createAvaliacaoController = new CreateAvaliacaoController();
const getAllAvaliacaoController = new GetAllAvaliacaoController();
const getByIdAvaliacaoController = new GetByIdAvaliacaoController();
const updateAvaliacaoController = new UpdateAvaliacaoController();
const deleteAvaliacaoController = new DeleteAvaliacaoController();

// Rotas Protegidas
avaliacaoRouter.post('/avaliacao', authMiddleware, createAvaliacaoController.handle);
avaliacaoRouter.get('/avaliacao', authMiddleware, getAllAvaliacaoController.handle);
avaliacaoRouter.get('/avaliacao/:id', authMiddleware, getByIdAvaliacaoController.handle);
// ✅ Rota Corrigida
avaliacaoRouter.put('/avaliacao/:id', authMiddleware, updateAvaliacaoController.handle);
// ✅ Rota Corrigida
avaliacaoRouter.delete('/avaliacao/:id', authMiddleware, deleteAvaliacaoController.handle);



export { avaliacaoRouter };
