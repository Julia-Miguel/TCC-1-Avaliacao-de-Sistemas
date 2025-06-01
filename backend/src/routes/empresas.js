// backend/src/routes/empresas.js
import { Router } from 'express';
import { CreateEmpresaController } from '../controller/empresas/CreateEmpresaController.js';
// ADICIONE A IMPORTAÇÃO DO NOVO CONTROLLER
import { LoginEmpresaController } from '../controller/empresas/LoginEmpresaController.js';


const empresasRouter = Router();

// Rota para criar uma nova empresa (Registro da Empresa)
const createEmpresaController = new CreateEmpresaController();
empresasRouter.post('/empresas/register', createEmpresaController.handle);

// ADICIONE A NOVA ROTA DE LOGIN DA EMPRESA
const loginEmpresaController = new LoginEmpresaController();
empresasRouter.post('/empresas/login', loginEmpresaController.handle);


export { empresasRouter };