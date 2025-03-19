import { Router } from 'express';
import { CreateUsuarioController } from '../controller/usuario/CreateUsuarioController.js';
import { GetAllUsuarioController } from '../controller/usuario/GetAllUsuarioController.js';
import { GetByIdUsuarioController } from '../controller/usuario/GetByIdUsuarioController.js';
import { UpdateUsuarioController } from '../controller/usuario/UpdateUsuarioController.js';
import { DeleteUsuarioController } from '../controller/usuario/DeleteUsuarioController.js';

const usuarioRouter = Router();

// Create
const createUsuarioController = new CreateUsuarioController();
usuarioRouter.post('/usuario', createUsuarioController.handle);

// Get All
const getAllUsuarioController = new GetAllUsuarioController();  
usuarioRouter.get('/usuario', getAllUsuarioController.handle);

// Get By Id
const getByIdUsuarioController = new GetByIdUsuarioController();
usuarioRouter.get('/usuario/:id', getByIdUsuarioController.handle);

// Update
const updateUsuarioController = new UpdateUsuarioController();
usuarioRouter.put('/usuario', updateUsuarioController.handle);

// Delete
const deleteUsuarioController = new DeleteUsuarioController();
usuarioRouter.delete('/usuario', deleteUsuarioController.handle);

export { usuarioRouter };