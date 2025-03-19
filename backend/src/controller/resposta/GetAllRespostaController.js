import { prisma } from '../../database/client.js';

export class GetAllRespostaController {
  async handle(request, response) {

    const respostas = await prisma.resposta.findMany({

      select: {
        id: true,
        resposta: true,
        pergunta: {
            select: {
                id: true,
                enunciado: true,
                tipos: true
            }
        },
        usuAval: {
            select:{
                id: true,
                status: true,
                isFinalizado: true,
                usuario: {
                    select: {
                        id: true,    // Selecione apenas os campos que deseja do usuario
                        nome: true,
                        email: true,
                        tipo: true,
                    },
                },
                avaliacao: {
                    select: {
                        id: true,        // Selecione apenas os campos que deseja da avaliacao
                        semestre: true,
                        questionarioId: true,
                    },
                },
            }
        }
      },
    }); 
    
    return response.json(respostas);
  }
}
