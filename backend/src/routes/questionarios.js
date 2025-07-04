// backend/src/routes/questionarios.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { GetAllQuestionarioController } from '../controller/questionarios/GetAllQuestionarioController.js';
import { GetByIdQuestionarioController } from '../controller/questionarios/GetByIdQuestionarioController.js';
import { CreateQuestionarioController } from '../controller/questionarios/CreateQuestionarioController.js';
import { UpdateQuestionarioController } from '../controller/questionarios/UpdateQuestionarioController.js';
import { DeleteQuestionarioController } from '../controller/questionarios/DeleteQuestionarioController.js';
import { GetQuestionarioAvaliacoesComRespostasController } from '../controller/questionarios/GetQuestionarioAvaliacoesComRespostasController.js';
import { ReorderQuestionariosController } from '../controller/questionarios/ReorderQuestionariosController.js'; // Importe o novo controller

const questionarioRouter = Router();

const getAllQuestionarioController = new GetAllQuestionarioController();
const getByIdQuestionarioController = new GetByIdQuestionarioController();
const createQuestionarioController = new CreateQuestionarioController();
const updateQuestionarioController = new UpdateQuestionarioController();
const deleteQuestionarioController = new DeleteQuestionarioController();
const getQuestionarioAvaliacoesComRespostasController = new GetQuestionarioAvaliacoesComRespostasController();
const reorderQuestionariosController = new ReorderQuestionariosController(); // Crie a instância

// Rota PÚBLICA (Exemplo - se você quisesse que a listagem fosse pública)
// questionarioRouter.get('/questionarios', getAllQuestionarioController.handle);
// questionarioRouter.get('/questionarios/:id', getByIdQuestionarioController.handle);


// Rotas PROTEGIDAS (Exigem token de ADMIN_EMPRESA)
// Supondo que toda a gestão de questionários é apenas para admins logados:
questionarioRouter.get('/questionarios', authMiddleware, getAllQuestionarioController.handle);
questionarioRouter.get('/questionarios/:id', authMiddleware, getByIdQuestionarioController.handle);
questionarioRouter.post('/questionarios', authMiddleware, createQuestionarioController.handle);
questionarioRouter.patch('/questionarios/:id', authMiddleware, updateQuestionarioController.handle);
questionarioRouter.delete('/questionarios/:id', authMiddleware, deleteQuestionarioController.handle);
questionarioRouter.get('/questionarios/:questionarioId/avaliacoes-com-respostas', authMiddleware, getQuestionarioAvaliacoesComRespostasController.handle);
questionarioRouter.patch('/reorder', authMiddleware, reorderQuestionariosController.handle);



export { questionarioRouter };