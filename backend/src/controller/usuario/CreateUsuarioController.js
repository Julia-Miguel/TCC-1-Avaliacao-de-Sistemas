import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import { TipoUsuario } from '@prisma/client';

export class CreateUsuarioController {
    async handle(request, response) {
        try {
            const { nome, email, senha, tipo } = request.body;
            const { empresaId } = request.user;
            if (!nome || !email || !senha || !tipo) {
                return response.status(400).json({
                    error: 'Campos obrigatórios ausentes: nome, email, senha, tipo.',
                });
            }
            if (!empresaId) {
                 return response.status(401).json({ error: 'Empresa do administrador não identificada. Faça login novamente.' });
            }
            if (!Object.values(TipoUsuario).includes(tipo)) {
                return response.status(400).json({
                    error: `Tipo de usuário inválido: '${tipo}'. Use um dos: ${Object.values(TipoUsuario).join(', ')}.`,
                });
            }
            const existingUserInCompany = await prisma.usuario.findFirst({
                where: { 
                    email: email,
                    empresaId: parseInt(empresaId)
                },
            });
            if (existingUserInCompany) {
                return response.status(409).json({ error: 'Este e-mail já está em uso nesta empresa.' });
            }
            const senhaHash = await bcrypt.hash(senha, 8);
            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    tipo,
                    empresa: {
                        connect: {
                            id: parseInt(empresaId)
                        }
                    }
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