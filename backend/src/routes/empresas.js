// backend/src/routes/empresas.js
import { Router } from 'express';
import { CreateEmpresaController } from '../controller/empresas/CreateEmpresaController.js';
import { LoginEmpresaController } from '../controller/empresas/LoginEmpresaController.js';

const empresasRouter = Router();

// Rota para criar uma nova empresa (Registro da Empresa) - PÚBLICA
const createEmpresaController = new CreateEmpresaController();
empresasRouter.post('/empresas/register', createEmpresaController.handle);

// Rota de Login da Empresa - PÚBLICA
const loginEmpresaController = new LoginEmpresaController();
empresasRouter.post('/empresas/login', loginEmpresaController.handle);

export { empresasRouter };