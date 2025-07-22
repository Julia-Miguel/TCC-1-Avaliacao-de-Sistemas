// ✅ ARQUIVO CORRIGIDO: src/routes/QuePerg.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { CreateQuePergController } from '../controller/quePerg/CreateQuePergController.js';
import { GetAllQuePergController } from '../controller/quePerg/GetAllQuePergController.js';
import { GetByIdQuePergController } from '../controller/quePerg/GetByIdQuePergController.js';
import { UpdateQuePergController } from '../controller/quePerg/UpdateQuePergController.js';
import { DeleteQuePergController } from '../controller/quePerg/DeleteQuePergController.js';

const quePergRouter = Router();

const createQuePergController = new CreateQuePergController();
const getAllQuePergController = new GetAllQuePergController();
const getByIdQuePergController = new GetByIdQuePergController();
const updateQuePergController = new UpdateQuePergController();
const deleteQuePergController = new DeleteQuePergController();

// Todas as rotas estão protegidas
quePergRouter.post('/queperg', authMiddleware, createQuePergController.handle);
quePergRouter.get('/queperg', authMiddleware, getAllQuePergController.handle);
quePergRouter.get('/queperg/:id', authMiddleware, getByIdQuePergController.handle);
quePergRouter.put('/queperg/:id', authMiddleware, updateQuePergController.handle);
// ✅ ROTA CORRIGIDA: Usando DELETE com :id
quePergRouter.delete('/queperg/:id', authMiddleware, deleteQuePergController.handle);

export { quePergRouter };
