import { Router } from 'express';

const mainRouter = Router();

// Apenas a rota raiz para verificar se o servidor está no ar
mainRouter.get('/', (request, response) => {
  response.json({ message: 'Server is running' });
});

// As rotas de login foram removidas daqui para evitar duplicidade.
// Elas agora vivem exclusivamente em 'usuario.js'.

export { mainRouter };
