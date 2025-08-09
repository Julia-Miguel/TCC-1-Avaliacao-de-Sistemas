import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { GetDashboardDataController } from '../controller/dashboard/GetDashboardDataController.js';
import { GetTextAnalysisController } from '../controller/dashboard/GetTextAnalysisController.js';
import { GetTimeDashboardController } from '../controller/dashboard/GetTimeDashboardController.js';

const dashboardRouter = Router();

const getDashboardDataController = new GetDashboardDataController();
const getTextAnalysisController = new GetTextAnalysisController();
const getTimeDashboardController = new GetTimeDashboardController();

dashboardRouter.get('/dashboard', authMiddleware, getDashboardDataController.handle);
dashboardRouter.get('/analise-texto', authMiddleware, getTextAnalysisController.handle);
dashboardRouter.get('/tempo-estimado', authMiddleware, getTimeDashboardController.handle);

export { dashboardRouter };
