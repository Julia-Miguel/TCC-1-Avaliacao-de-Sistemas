import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import { TipoUsuario } from '@prisma/client';

export class CreateUsuarioController {
  async handle(request, response) {
    try {
      const { nome, email, senha, tipo } = request.body;

      if (!nome || !email || !senha || !tipo) {
        return response.status(400).json({
          error: 'Campos obrigatórios ausentes: nome, email, senha, tipo.',
        });
      }

      // Validação do enum
      if (!Object.values(TipoUsuario).includes(tipo)) {
        return response.status(400).json({
          error: `Tipo de usuário inválido: '${tipo}'. Use um dos: ${Object.values(TipoUsuario).join(', ')}.`,
        });
      }

      // 🔒 Verificação de e-mail duplicado
      const existingUser = await prisma.usuario.findUnique({
        where: { email },
      });

      if (existingUser) {
        return response.status(400).json({ error: 'Este e-mail já está em uso.' });
      }

      const senhaHash = await bcrypt.hash(senha, 8);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          tipo,
        },
      });

      const { senha: _, ...usuarioSemSenha } = usuario;
      return response.status(201).json(usuarioSemSenha);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Falha ao criar usuário.', details: error.message });
    }
  }
}
