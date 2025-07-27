import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { GetDashboardDataController } from '../controller/dashboard/GetDashboardDataController.js';
import { GetTextAnalysisController } from '../controller/dashboard/GetTextAnalysisController.js';
import { GetTimeDashboardController } from '../controller/dashboard/GetTimeDashboardController.js'; // Importe o novo controller

const dashboardRouter = Router();

const getDashboardDataController = new GetDashboardDataController();
const getTextAnalysisController = new GetTextAnalysisController();
const getTimeDashboardController = new GetTimeDashboardController(); // Crie a instância

// Rota para os dados gerais do dashboard
dashboardRouter.get('/dashboard', authMiddleware, getDashboardDataController.handle);

// Rota para a análise de texto (nuvem de palavras)
dashboardRouter.get('/analise-texto', authMiddleware, getTextAnalysisController.handle);

// Nova rota para o tempo estimado
dashboardRouter.get('/tempo-estimado', authMiddleware, getTimeDashboardController.handle);

export { dashboardRouter };
