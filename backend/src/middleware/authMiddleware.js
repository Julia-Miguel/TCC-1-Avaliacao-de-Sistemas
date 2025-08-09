// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-jwt';

export const authMiddleware = (request, response, next) => {
    console.log('[AuthMiddleware] Verificando rota:', request.method, request.originalUrl);
    const authHeader = request.headers.authorization;
    console.log('[AuthMiddleware] Cabeçalho Authorization:', authHeader);

    if (!authHeader) {
        console.log('[AuthMiddleware] Falha: Token não fornecido.');
        return response.status(401).json({ message: "Token não fornecido." });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        console.log('[AuthMiddleware] Falha: Erro no formato do token (não são 2 partes).');
        return response.status(401).json({ message: "Erro no formato do token." });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        console.log('[AuthMiddleware] Falha: Token malformatado (não é Bearer). Scheme:', scheme);
        return response.status(401).json({ message: "Token malformatado." });
    }

    console.log('[AuthMiddleware] Token recebido para verificação:', token ? 'SIM' : 'NÃO');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("[AuthMiddleware] Erro na verificação do JWT:", err.name, err.message);
            if (err.name === 'TokenExpiredError') {
                return response.status(401).json({ message: "Token expirado." });
            }
            return response.status(401).json({ message: "Token inválido." });
        }

        console.log('[AuthMiddleware] Token decodificado:', decoded);
        request.user = decoded;

        if (request.user.tipo !== 'ADMIN_EMPRESA') {
            console.log('[AuthMiddleware] Falha: Permissão insuficiente. Tipo do usuário:', request.user.tipo);
            return response.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
        }
        
        console.log('[AuthMiddleware] Autorizado. Prosseguindo...');
        return next();
    });
};