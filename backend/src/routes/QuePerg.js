import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CreateQuePergController } from '../controller/quePerg/CreateQuePergController.js';
import { GetAllQuePergController } from '../controller/quePerg/GetAllQuePergController.js';
import { GetByIdQuePergController } from '../controller/quePerg/GetByIdQuePergController.js';
import { UpdateQuePergController } from '../controller/quePerg/UpdateQuePergController.js';
import { DeleteQuePergController } from '../controller/quePerg/DeleteQuePergController.js';

const quePergRouter = Router();

// Create
const createQuePergController = new CreateQuePergController();
quePergRouter.post('/queperg', authMiddleware, createQuePergController.handle);

//GET ALL
const getAllQuePergController = new GetAllQuePergController();
quePergRouter.get('/queperg', authMiddleware, getAllQuePergController.handle);

//GET BY ID
const getByIdQuePergController = new GetByIdQuePergController();
quePergRouter.get('/queperg/:id', authMiddleware, getByIdQuePergController.handle);

//UPDATE
const updateQuePergController = new UpdateQuePergController();
quePergRouter.put('/queperg', authMiddleware, updateQuePergController.handle);

//DELETE
const deleteQuePergController = new DeleteQuePergController();
quePergRouter.delete('/queperg', authMiddleware, deleteQuePergController.handle);

export { quePergRouter };
