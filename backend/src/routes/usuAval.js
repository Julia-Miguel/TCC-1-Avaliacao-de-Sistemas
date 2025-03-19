import { Router } from 'express';
import { CreateUsuAvalController } from '../controller/usuAval/CreateUsuAvalController.js';
import { GetAllUsuAvalController } from '../controller/usuAval/GetAllUsuAvalController.js';
import { GetByIdUsuAvalController } from '../controller/usuAval/GetByIdUsuAvalController.js';
import { UpdateUsuAvalController } from '../controller/usuAval/UpdateUsuAvalController.js';
import { DeleteUsuAvalController } from '../controller/usuAval/DeleteUsuAvalController.js';

const usuAvalRouter = Router();


// Create
const createUsuAvalController = new CreateUsuAvalController();
usuAvalRouter.post('/usuAval', createUsuAvalController.handle);

// GET ALL
const getAllUsuAvalController = new GetAllUsuAvalController();
usuAvalRouter.get('/usuAval', getAllUsuAvalController.handle);

// GET BY ID
const getByIdUsuAvalController = new GetByIdUsuAvalController();
usuAvalRouter.get('/usuAval/:id', getByIdUsuAvalController.handle);

// Update
const updateUsuAvalController = new UpdateUsuAvalController();
usuAvalRouter.put('/usuAval', updateUsuAvalController.handle);

// Delete
const deleteUsuAvalController = new DeleteUsuAvalController();
usuAvalRouter.delete('/usuAval', deleteUsuAvalController.handle);

export { usuAvalRouter };