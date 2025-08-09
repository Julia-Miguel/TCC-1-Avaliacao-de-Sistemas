// backend/src/controller/usuario/LoginAdminEmpresaUsuarioController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-jwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export class LoginAdminEmpresaUsuarioController {
    async handle(request, response) {
        const { email, senha, empresaId } = request.body;

        if (!email || !senha || !empresaId) {
            return response.status(400).json({
                message: "Email, senha e ID da empresa são obrigatórios para login do administrador."
            });
        }

        try {
            const adminUsuario = await prisma.usuario.findFirst({
                where: {
                    email: email,
                    empresaId: parseInt(empresaId),
                    tipo: 'ADMIN_EMPRESA'
                }
            });

            if (!adminUsuario) {
                return response.status(401).json({ message: "Credenciais de administrador inválidas ou usuário não é admin desta empresa." });
            }

            const senhaCorreta = await bcrypt.compare(senha, adminUsuario.senha);

            if (!senhaCorreta) {
                return response.status(401).json({ message: "Credenciais de administrador inválidas." });
            }

            const tokenPayload = {
                usuarioId: adminUsuario.id,
                empresaId: adminUsuario.empresaId,
                tipo: adminUsuario.tipo,
                nome: adminUsuario.nome,
                email: adminUsuario.email
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN 
            });

            const { senha: _, ...adminSemSenha } = adminUsuario;

            return response.status(200).json({
                message: "Login do administrador bem-sucedido!",
                admin: adminSemSenha,
                token: token
            });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao tentar logar administrador." });
        }
    }
}