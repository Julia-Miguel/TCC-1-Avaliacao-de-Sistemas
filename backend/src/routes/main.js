import { Router } from 'express';
import { LoginClientePlataformaUsuarioController } from '../controller/usuario/LoginClientePlataformaUsuarioController.js';
import { LoginAdminEmpresaUsuarioController } from '../controller/usuario/LoginAdminEmpresaUsuarioController.js';

const mainRouter = Router();

const loginCliente = new LoginClientePlataformaUsuarioController();
const loginAdmin = new LoginAdminEmpresaUsuarioController();

mainRouter.get('/', (request, response) => {
  response.json({ message: 'Server is running' });
});

// 🔧 Rotas de login necessárias para os testes funcionarem
mainRouter.post('/clientes/login', (req, res) => loginCliente.handle(req, res));
mainRouter.post('/admin/login', (req, res) => loginAdmin.handle(req, res));

export { mainRouter };
