// backend/src/controller/usuario/LoginClientePlataformaUsuarioController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-jwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN_CLIENTE || '24h';

export class LoginClientePlataformaUsuarioController {
    async handle(request, response) {
        const { email, senha } = request.body;

        if (!email || !senha) {
            return response.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        try {
            const clienteUsuario = await prisma.usuario.findUnique({
                where: {
                    email: email,
                }
            });

            if (!clienteUsuario || clienteUsuario.tipo !== 'CLIENTE_PLATAFORMA') {
                return response.status(401).json({ message: "Credenciais de cliente inválidas ou tipo de usuário incorreto." });
            }

            const senhaCorreta = await bcrypt.compare(senha, clienteUsuario.senha);

            if (!senhaCorreta) {
                return response.status(401).json({ message: "Credenciais de cliente inválidas." });
            }

            const tokenPayload = {
                usuarioId: clienteUsuario.id,
                tipo: clienteUsuario.tipo,
                nome: clienteUsuario.nome,
                email: clienteUsuario.email
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN 
            });

            const { senha: _, ...clienteSemSenha } = clienteUsuario;

            return response.status(200).json({
                message: "Login do cliente bem-sucedido!",
                cliente: clienteSemSenha,
                token: token
            });

        } catch (error) {
            console.error("Erro ao tentar logar cliente:", error);
            return response.status(500).json({ message: "Erro interno ao tentar logar cliente." });
        }
    }
}