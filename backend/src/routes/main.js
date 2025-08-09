import { Router } from 'express';

const mainRouter = Router();

// Apenas a rota raiz para verificar se o servidor está no ar
mainRouter.get('/', (request, response) => {
  response.json({ message: 'Server is running' });
});


export { mainRouter };
