// backend/src/controller/empresas/LoginEmpresaController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

export class LoginEmpresaController {
    async handle(request, response) {
        const { emailResponsavel, senhaEmpresa } = request.body;

        // Validação básica
        if (!emailResponsavel || !senhaEmpresa) {
            return response.status(400).json({
                message: "Email do responsável e senha da empresa são obrigatórios."
            });
        }

        try {
            // 1. Encontrar a empresa pelo email
            const empresa = await prisma.empresa.findUnique({
                where: {
                    emailResponsavel: emailResponsavel
                }
            });

            if (!empresa) {
                return response.status(401).json({ message: "Credenciais da empresa inválidas." });
            }

            // 2. Comparar a senha enviada com a senha hasheada no banco
            const senhaCorreta = await bcrypt.compare(senhaEmpresa, empresa.senhaEmpresa);

            if (!senhaCorreta) {
                return response.status(401).json({ message: "Credenciais da empresa inválidas." });
            }

            // 3. Login bem-sucedido: retornar dados da empresa (sem a senha)
            // O frontend usará esses dados para saber qual empresa logou e prosseguir
            // para o login do administrador específico daquela empresa.
            const { senhaEmpresa: _, ...empresaSemSenha } = empresa; // Remove a senha do objeto

            return response.status(200).json({
                message: "Login da empresa bem-sucedido!",
                empresa: empresaSemSenha
            });

        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao tentar logar empresa." });
        }
    }
}