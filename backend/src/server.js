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

const server = express();
const PORT = 4444;

// Middleware para analisar o corpo das requisições JSON
server.use(express.json());
server.use(cors());

server.use(mainRouter);
server.use(questionarioRouter);
server.use(quePergRouter);
server.use(perguntasRouter);
server.use(avaliacaoRouter);
server.use(usuarioRouter);
server.use(usuAvalRouter);
server.use(respostaRouter);

// Routes
server.get('/', (request, response) => {
    response.json({
        message: 'Status: Server is running.'
    });
});

server.listen(PORT, () => {
    console.log(`[SERVER] Server is running on port ${PORT}`);
});