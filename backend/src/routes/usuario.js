// backend/src/routes/usuario.js
import { Router } from 'express';
import { CreateUsuarioController } from '../controller/usuario/CreateUsuarioController.js';
import { GetAllUsuarioController } from '../controller/usuario/GetAllUsuarioController.js';
import { GetByIdUsuarioController } from '../controller/usuario/GetByIdUsuarioController.js';
import { UpdateUsuarioController } from '../controller/usuario/UpdateUsuarioController.js';
import { DeleteUsuarioController } from '../controller/usuario/DeleteUsuarioController.js';
import { CreateAdminEmpresaUsuarioController } from '../controller/usuario/CreateAdminEmpresaUsuarioController.js';
import { LoginAdminEmpresaUsuarioController } from '../controller/usuario/LoginAdminEmpresaUsuarioController.js';
import { CreateClientePlataformaUsuarioController } from '../controller/usuario/CreateClientePlataformaUsuarioController.js';
import { LoginClientePlataformaUsuarioController } from '../controller/usuario/LoginClientePlataformaUsuarioController.js';

const usuarioRouter = Router();

const createClientePlataformaUsuarioController = new CreateClientePlataformaUsuarioController();
usuarioRouter.post('/clientes/register', createClientePlataformaUsuarioController.handle);

const loginClientePlataformaUsuarioController = new LoginClientePlataformaUsuarioController();
usuarioRouter.post('/clientes/login', loginClientePlataformaUsuarioController.handle);

// Rota para criar um usuário ADMIN_EMPRESA
const createAdminEmpresaUsuarioController = new CreateAdminEmpresaUsuarioController();
usuarioRouter.post('/usuarios/register-admin', createAdminEmpresaUsuarioController.handle);

// ADICIONE A NOVA ROTA DE LOGIN DO ADMIN_EMPRESA
const loginAdminEmpresaUsuarioController = new LoginAdminEmpresaUsuarioController();
usuarioRouter.post('/usuarios/login-admin', loginAdminEmpresaUsuarioController.handle);


// Rota para criar um usuário CLIENTE_PLATAFORMA (já existente, pode precisar de ajuste no tipo depois)
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