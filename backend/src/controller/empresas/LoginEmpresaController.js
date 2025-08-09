// backend/src/controller/empresas/LoginEmpresaController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

export class LoginEmpresaController {
    async handle(request, response) {
        const { emailResponsavel, senhaEmpresa } = request.body;

        console.log('Corpo recebido:', request.body);

        if (!emailResponsavel || !senhaEmpresa) {
            return response.status(400).json({
                message: "Email do responsável e senha da empresa são obrigatórios."
            });
        }

        try {
            const empresa = await prisma.empresa.findUnique({
                where: { emailResponsavel: emailResponsavel }
            });
            console.log('Empresa encontrada no banco:', empresa);

            if (!empresa) {
                console.log('Empresa não encontrada no banco.');
                return response.status(401).json({ message: "Credenciais da empresa inválidas." });
            }

            console.log('Senha recebida:', senhaEmpresa);
            console.log('Senha hasheada no banco:', empresa.senhaEmpresa);
            const senhaCorreta = await bcrypt.compare(senhaEmpresa, empresa.senhaEmpresa);
            console.log('Resultado da comparação de senha:', senhaCorreta);

            if (!senhaCorreta) {
                console.log('Comparação de senha falhou.');
                return response.status(401).json({ message: "Credenciais da empresa inválidas." });
            }
            const { senhaEmpresa: _, ...empresaSemSenha } = empresa;

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