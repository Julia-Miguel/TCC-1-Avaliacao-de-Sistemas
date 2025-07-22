// src/controller/perguntas/CreatePerguntasController.js
import { prisma } from '../../database/client.js';

export class CreatePerguntasController {
    async handle(request, response) {
        const { enunciado, tipos, obrigatoria } = request.body;
        try {
            const pergunta = await prisma.pergunta.create({
                data: {
                    enunciado,
                    tipos,
                    obrigatoria: !!obrigatoria,
                },
            });
            // ✅ CORREÇÃO: Retornando status 201
            return response.status(201).json(pergunta);
        } catch (error) {
            return response.status(400).json({ message: "Erro ao criar pergunta.", error: error.message });
        }
    }
}
