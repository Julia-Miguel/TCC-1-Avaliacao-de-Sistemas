// backend/src/controller/usuario/LoginAdminEmpresaUsuarioController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Para gerar o Token JWT

// Você precisará de uma chave secreta para o JWT. GUARDE-A BEM e NÃO a exponha no código em produção!
// Idealmente, ela viria de uma variável de ambiente (process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-jwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';// Por quanto tempo o token é válido

export class LoginAdminEmpresaUsuarioController {
    async handle(request, response) {
        const { email, senha, empresaId } = request.body;

        // Validação básica
        if (!email || !senha || !empresaId) {
            return response.status(400).json({
                message: "Email, senha e ID da empresa são obrigatórios para login do administrador."
            });
        }

        try {
            // 1. Encontrar o usuário admin pelo email, tipo e empresaId
            const adminUsuario = await prisma.usuario.findFirst({
                where: {
                    email: email,
                    empresaId: parseInt(empresaId),
                    tipo: 'ADMIN_EMPRESA' // Garante que é um admin da empresa
                }
            });

            if (!adminUsuario) {
                return response.status(401).json({ message: "Credenciais de administrador inválidas ou usuário não é admin desta empresa." });
            }

            // 2. Comparar a senha enviada com a senha hasheada no banco
            const senhaCorreta = await bcrypt.compare(senha, adminUsuario.senha);

            if (!senhaCorreta) {
                return response.status(401).json({ message: "Credenciais de administrador inválidas." });
            }

            // 3. Login bem-sucedido: Gerar o Token JWT
            const tokenPayload = {
                usuarioId: adminUsuario.id,
                empresaId: adminUsuario.empresaId,
                tipo: adminUsuario.tipo,
                nome: adminUsuario.nome,
                email: adminUsuario.email
                // Não inclua informações sensíveis como a senha no payload!
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN 
            });

            // Retornar o token e alguns dados do usuário (sem a senha)
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