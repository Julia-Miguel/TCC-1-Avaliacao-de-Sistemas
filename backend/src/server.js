// backend/src/server.js

import 'dotenv/config';
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

const app = express();

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];

console.log('Origens permitidas no backend (FRONTEND_URL):', allowedOrigins); // Novo log aqui

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Origem da requisição recebida:', origin); // Novo log aqui
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pela política de CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', mainRouter);
app.use('/api', questionarioRouter);
app.use('/api', quePergRouter);
app.use('/api', perguntasRouter);
app.use('/api', avaliacaoRouter);
app.use('/api', usuarioRouter);
app.use('/api', usuAvalRouter);
app.use('/api', respostaRouter);
app.use('/api', empresasRouter);
app.use('/api', dashboardRouter);
app.use('/api', publicAvaliacaoRoutes);

app.get('/', (request, response) => {
    response.json({
        message: 'Status: Server is running.'
    });
});

export { app };