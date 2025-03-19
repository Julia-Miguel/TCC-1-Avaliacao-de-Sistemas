import { Router } from 'express';
import { CreateQuePergController } from '../controller/quePerg/CreateQuePergController.js';
import { GetAllQuePergController } from '../controller/quePerg/GetAllQuePergController.js';
import { GetByIdQuePergController } from '../controller/quePerg/GetByIdQuePergController.js';
import { UpdateQuePergController } from '../controller/quePerg/UpdateQuePergController.js';
import { DeleteQuePergController } from '../controller/quePerg/DeleteQuePergController.js';

const quePergRouter = Router();

// Create
const createQuePergController = new CreateQuePergController();
quePergRouter.post('/queperg', createQuePergController.handle);

//GET ALL
const getAllQuePergController = new GetAllQuePergController();
quePergRouter.get('/queperg', getAllQuePergController.handle);

//GET BY ID
const getByIdQuePergController = new GetByIdQuePergController();
quePergRouter.get('/queperg/:id', getByIdQuePergController.handle);

//UPDATE
const updateQuePergController = new UpdateQuePergController();
quePergRouter.put('/queperg', updateQuePergController.handle);

//DELETE
const deleteQuePergController = new DeleteQuePergController();
quePergRouter.delete('/queperg', deleteQuePergController.handle);

export { quePergRouter };
