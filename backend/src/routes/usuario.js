// src/routes/usuario.js

import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

// Importando os controllers
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

// --- Instâncias dos Controllers ---
const createUsuarioController = new CreateUsuarioController();
const getAllUsuarioController = new GetAllUsuarioController();
const getByIdUsuarioController = new GetByIdUsuarioController();
const updateUsuarioController = new UpdateUsuarioController();
const deleteUsuarioController = new DeleteUsuarioController();
const createAdminEmpresaUsuarioController = new CreateAdminEmpresaUsuarioController();
const loginAdminEmpresaUsuarioController = new LoginAdminEmpresaUsuarioController();
const createClientePlataformaUsuarioController = new CreateClientePlataformaUsuarioController();
const loginClientePlataformaUsuarioController = new LoginClientePlataformaUsuarioController();


// --- Rotas Públicas ---
// Rotas para clientes da plataforma se registrarem e logarem
usuarioRouter.post('/clientes/register', createClientePlataformaUsuarioController.handle);
usuarioRouter.post('/clientes/login', loginClientePlataformaUsuarioController.handle);
// Rota para o PRIMEIRO admin de uma nova empresa se registrar
usuarioRouter.post('/usuarios/register-admin', createAdminEmpresaUsuarioController.handle);
// Rota para admins logarem
usuarioRouter.post('/usuarios/login-admin', loginAdminEmpresaUsuarioController.handle);


// --- Rotas Protegidas (Exigem autenticação) ---
// Rota para um admin LOGADO criar OUTROS usuários para sua empresa
usuarioRouter.post('/usuario', authMiddleware, createUsuarioController.handle);

// Rotas para gerenciar usuários (ver todos, ver um, atualizar, deletar)
usuarioRouter.get('/usuario', authMiddleware, getAllUsuarioController.handle);
usuarioRouter.get('/usuario/:id', authMiddleware, getByIdUsuarioController.handle);
usuarioRouter.put('/usuario', authMiddleware, updateUsuarioController.handle); 
usuarioRouter.delete('/usuario/:id', authMiddleware, deleteUsuarioController.handle);


export { usuarioRouter };