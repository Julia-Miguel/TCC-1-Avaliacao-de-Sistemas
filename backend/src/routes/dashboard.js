// backend/src/routes/dashboard.js
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { GetDashboardDataController } from '../controller/dashboard/GetDashboardDataController.js';
import { GetTextAnalysisController } from '../controller/dashboard/GetTextAnalysisController.js';

const dashboardRouter = Router();

const getDashboardDataController = new GetDashboardDataController();
const getTextAnalysisController = new GetTextAnalysisController();

// A mesma rota serve para o geral e o específico, controlado pelo query param
dashboardRouter.get('/dashboard', authMiddleware, getDashboardDataController.handle);

dashboardRouter.get('/analise-texto', authMiddleware, getTextAnalysisController.handle);

export { dashboardRouter };