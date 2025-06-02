import { Router } from 'express';
import { CreatePerguntasController } from '../controller/perguntas/CreatePerguntasController.js';
import { GetAllPerguntasController } from '../controller/perguntas/GetAllPerguntasController.js';
import { GetByIdPerguntasController } from '../controller/perguntas/GetByIdPerguntasController.js';
import { UpdatePerguntasController } from '../controller/perguntas/UpdatePerguntasController.js'; 
import { DeletePerguntasController } from '../controller/perguntas/DeletePerguntasController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const perguntasRouter = Router();

// Create
const createPerguntasController = new CreatePerguntasController();
perguntasRouter.post('/perguntas', authMiddleware, createPerguntasController.handle);

//GET ALL
const getAllPerguntasController = new GetAllPerguntasController();
perguntasRouter.get('/perguntas', authMiddleware, getAllPerguntasController.handle);

//GET BY ID
const getByIdPerguntasController = new GetByIdPerguntasController();
perguntasRouter.get('/perguntas/:id', authMiddleware, getByIdPerguntasController.handle);

//UPDATE
const updatePerguntasController = new UpdatePerguntasController();
perguntasRouter.put('/perguntas', authMiddleware, updatePerguntasController.handle);

//DELETE
const deletePerguntasController = new DeletePerguntasController();
perguntasRouter.delete('/perguntas', authMiddleware, deletePerguntasController.handle);

export { perguntasRouter };