import express from 'express';
import cors from "cors";
import { mainRouter } from './routes/main.js';
import { questionarioRouter } from './routes/questionarios.js';
import { quePergRouter } from './routes/QuePerg.js';
import { perguntasRouter } from './routes/perguntas.js';
import { avaliacaoRouter } from './routes/avaliacao.js';
import { usuarioRouter } from './routes/usuario.js';
import { usuAvalRouter } from './routes/usuAval.js';
import { respostaRouter } from './routes/resposta.js';
import { empresasRouter } from './routes/empresas.js';
import { dashboardRouter } from './routes/dashboard.js';
import { publicAvaliacaoRoutes } from './routes/publicAvaliacao.js';

// Corrigido: renomeado de 'server' para 'app' para consistência
const app = express();

// Middleware para analisar o corpo das requisições JSON
app.use(express.json());
app.use(cors());

// Corrigido: usando 'app.use'
app.use(mainRouter);
app.use(questionarioRouter);
app.use(quePergRouter);
app.use(perguntasRouter);
app.use(avaliacaoRouter);
app.use(usuarioRouter);
app.use(usuAvalRouter);
app.use(respostaRouter);
app.use(empresasRouter);
app.use(dashboardRouter);
app.use(publicAvaliacaoRoutes);


// Routes
app.get('/', (request, response) => {
    response.json({
        message: 'Status: Server is running.'
    });
});

// Corrigido: exportando a variável 'app' que agora está definida
export { app };
