import { Router } from 'express';
import { CreatePerguntasController } from '../controller/perguntas/CreatePerguntasController.js';
import { GetAllPerguntasController } from '../controller/perguntas/GetAllPerguntasController.js';
import { GetByIdPerguntasController } from '../controller/perguntas/GetByIdPerguntasController.js';
import { UpdatePerguntasController } from '../controller/perguntas/UpdatePerguntasController.js'; 
import { DeletePerguntasController } from '../controller/perguntas/DeletePerguntasController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const perguntasRouter = Router();

const createPerguntasController = new CreatePerguntasController();
const getAllPerguntasController = new GetAllPerguntasController();
const getByIdPerguntasController = new GetByIdPerguntasController();
const updatePerguntasController = new UpdatePerguntasController();
const deletePerguntasController = new DeletePerguntasController();

perguntasRouter.post('/perguntas', authMiddleware, createPerguntasController.handle);
perguntasRouter.get('/perguntas', authMiddleware, getAllPerguntasController.handle);
perguntasRouter.get('/perguntas/:id', authMiddleware, getByIdPerguntasController.handle);
perguntasRouter.patch('/perguntas/:id', authMiddleware, updatePerguntasController.handle);
perguntasRouter.delete('/perguntas/:id', authMiddleware, deletePerguntasController.handle);

export { perguntasRouter };
