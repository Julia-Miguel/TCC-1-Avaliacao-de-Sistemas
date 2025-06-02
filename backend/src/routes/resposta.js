import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CreateRespostaController } from '../controller/resposta/CreateRespostaController.js';
import { GetAllRespostaController } from '../controller/resposta/GetAllRespostaController.js';
import { GetByIdRespostaController } from '../controller/resposta/GetByIdRespostaController.js';
import { UpdateRespostaController } from '../controller/resposta/UpdateRespostaController.js';
import { DeleteRespostaController } from '../controller/resposta/DeleteRespostaController.js';


const respostaRouter = Router();


// Create
const createRespostaController = new CreateRespostaController();
respostaRouter.post('/respostas', authMiddleware, createRespostaController.handle);

// GET ALL
const getAllRespostaController = new GetAllRespostaController();
respostaRouter.get('/respostas', authMiddleware, getAllRespostaController.handle);

// GET BY ID
const getByIdRespostaController = new GetByIdRespostaController();
respostaRouter.get('/respostas/:id', authMiddleware, getByIdRespostaController.handle);

// Update
const updateRespostaController = new UpdateRespostaController();
respostaRouter.put('/respostas', authMiddleware, updateRespostaController.handle);

// Delete
const deleteRespostaController = new DeleteRespostaController();
respostaRouter.delete('/respostas', authMiddleware, deleteRespostaController.handle);

export { respostaRouter };