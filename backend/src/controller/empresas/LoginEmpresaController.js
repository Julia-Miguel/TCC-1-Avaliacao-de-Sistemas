// backend/src/controller/empresas/LoginEmpresaController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

export class LoginEmpresaController {
    async handle(request, response) {
        const { emailResponsavel, senhaEmpresa } = request.body;

        console.log('Corpo recebido:', request.body);

        // Validação básica
        if (!emailResponsavel || !senhaEmpresa) {
            return response.status(400).json({
                message: "Email do responsável e senha da empresa são obrigatórios."
            });
        }

        try {
            const empresa = await prisma.empresa.findUnique({
                where: { emailResponsavel: emailResponsavel }
            });
            console.log('Empresa encontrada no banco:', empresa); // LOG 2

            if (!empresa) {
                console.log('Empresa não encontrada no banco.'); // LOG 3
                return response.status(401).json({ message: "Credenciais da empresa inválidas." });
            }

            console.log('Senha recebida:', senhaEmpresa); // LOG 4
            console.log('Senha hasheada no banco:', empresa.senhaEmpresa); // LOG 5
            const senhaCorreta = await bcrypt.compare(senhaEmpresa, empresa.senhaEmpresa);
            console.log('Resultado da comparação de senha:', senhaCorreta); // LOG 6

            if (!senhaCorreta) {
                console.log('Comparação de senha falhou.'); // LOG 7
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