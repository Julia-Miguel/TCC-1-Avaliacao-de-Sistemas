import { Router } from 'express';
import { CreateRespostaController } from '../controller/resposta/CreateRespostaController.js';
import { GetAllRespostaController } from '../controller/resposta/GetAllRespostaController.js';
import { GetByIdRespostaController } from '../controller/resposta/GetByIdRespostaController.js';
import { UpdateRespostaController } from '../controller/resposta/UpdateRespostaController.js';
import { DeleteRespostaController } from '../controller/resposta/DeleteRespostaController.js';

const respostaRouter = Router();


// Create
const createRespostaController = new CreateRespostaController();
respostaRouter.post('/respostas', createRespostaController.handle);

// GET ALL
const getAllRespostaController = new GetAllRespostaController();
respostaRouter.get('/respostas', getAllRespostaController.handle);

// GET BY ID
const getByIdRespostaController = new GetByIdRespostaController();
respostaRouter.get('/respostas/:id', getByIdRespostaController.handle);

// Update
const updateRespostaController = new UpdateRespostaController();
respostaRouter.put('/respostas', updateRespostaController.handle);

// Delete
const deleteRespostaController = new DeleteRespostaController();
respostaRouter.delete('/respostas', deleteRespostaController.handle);

export { respostaRouter };