import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CreateAvaliacaoController } from '../controller/avaliacao/CreateAvaliacaoController.js';
import { GetAllAvaliacaoController } from '../controller/avaliacao/GetAllAvaliacaoController.js';
import { GetByIdAvaliacaoController } from '../controller/avaliacao/GetByIdAvaliacaoController.js';
import { UpdateAvaliacaoController } from '../controller/avaliacao/UpdateAvaliacaoController.js';
import { DeleteAvaliacaoController } from '../controller/avaliacao/DeleteAvaliacaoController.js';
import { GetPublicAvaliacaoByIdController } from '../controller/public/avaliacao/GetPublicAvaliacaoByIdController.js'; 

const avaliacaoRouter = Router();

// Create
const createAvaliacaoController = new CreateAvaliacaoController();
avaliacaoRouter.post('/avaliacao', authMiddleware, createAvaliacaoController.handle);

// GET ALL
const getAllAvaliacaoController = new GetAllAvaliacaoController();
avaliacaoRouter.get('/avaliacao', authMiddleware, getAllAvaliacaoController.handle);

// GET BY ID
const getByIdAvaliacaoController = new GetByIdAvaliacaoController();
avaliacaoRouter.get('/avaliacao/:id', authMiddleware, getByIdAvaliacaoController.handle);

// Update
const updateAvaliacaoController = new UpdateAvaliacaoController();
avaliacaoRouter.put('/avaliacao', authMiddleware, updateAvaliacaoController.handle);

// Delete
const deleteAvaliacaoController = new DeleteAvaliacaoController();
avaliacaoRouter.delete('/avaliacao', authMiddleware, deleteAvaliacaoController.handle);

// Public GET BY ID
const getPublicAvaliacaoByIdController = new GetPublicAvaliacaoByIdController();
avaliacaoRouter.get('/public/avaliacoes/:id', getPublicAvaliacaoByIdController.handle);

export { avaliacaoRouter };