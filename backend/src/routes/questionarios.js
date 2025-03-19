import { Router } from 'express';
import { GetAllQuestionarioController } from '../controller/questionarios/GetAllQuestionarioController.js';
import { GetByIdQuestionarioController } from '../controller/questionarios/GetByIdQuestionarioController.js';
import { CreateQuestionarioController } from '../controller/questionarios/CreateQuestionarioController.js';
import { UpdateQuestionarioController } from '../controller/questionarios/UpdateQuestionarioController.js';
import { DeleteQuestionarioController } from '../controller/questionarios/DeleteQuestionarioController.js';

const questionarioRouter = Router();

// Get All/Select
const getAllQuestionarioController = new GetAllQuestionarioController();
questionarioRouter.get('/questionarios', getAllQuestionarioController.handle);

// Get By Id
const getByIdQuestionarioController = new GetByIdQuestionarioController();
questionarioRouter.get('/questionarios/:id', getByIdQuestionarioController.handle);

// Create
const createQuestionarioController = new CreateQuestionarioController();
questionarioRouter.post('/questionarios', createQuestionarioController.handle); 

// Update
const updateQuestionarioController = new UpdateQuestionarioController();
questionarioRouter.put('/questionarios', updateQuestionarioController.handle);

// Delete
const deleteQuestionarioController = new DeleteQuestionarioController();
questionarioRouter.delete('/questionarios', deleteQuestionarioController.handle);

export { questionarioRouter };