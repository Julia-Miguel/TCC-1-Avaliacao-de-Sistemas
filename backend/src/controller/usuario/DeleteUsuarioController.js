// backend/src/controller/usuario/DeleteUsuarioController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class DeleteUsuarioController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const targetId = Number(id);

      // Pegue os dados do token onde quer que eles tenham sido colocados:
      const usuarioLogadoId = Number(
        req.usuarioId ??                 // caso algum outro middleware/populador já tenha setado
        req.user?.usuarioId ??           // payload nomeado como usuarioId
        req.user?.id ??                  // payload nomeado como id
        null
      );

      const role = req.tipo ?? req.user?.tipo ?? null;
      const empresaIdDoToken = req.empresaId ?? req.user?.empresaId ?? null;

      console.log(`[DEPURAÇÃO] ID vindo do token (raw): ${usuarioLogadoId} tipo: ${typeof usuarioLogadoId}`);
      console.log(`[DEPURAÇÃO] Tipo/role vindo do token: ${role}`);
      console.log(`[DEPURAÇÃO] Tentativa de exclusão: ID recurso (URL): ${targetId}, ID usuário logado: ${usuarioLogadoId}`);

      if (!usuarioLogadoId) {
        return res.status(401).json({ error: 'Usuário não autenticado corretamente.' });
      }

      // Regra de permissão:
      // - dono do usuário pode deletar (usuarioLogadoId === targetId)
      // - ou ADMIN_SISTEMA pode deletar (se existirem tokens com esse tipo)
      // - se quiser autorizar ADMIN_EMPRESA para deletar somente usuários da mesma empresa,
      //   comente esta linha e eu te mostro como.
      if (usuarioLogadoId !== targetId && role !== 'ADMIN_SISTEMA') {
        return res.status(403).json({ error: 'Sem permissão para deletar este usuário' });
      }

      console.log(`[DEPURAÇÃO] Deletando respostas do usuário ${targetId}...`);
      await prisma.resposta.deleteMany({
        where: {
          usuAval: { usuarioId: targetId }
        }
      });

      console.log(`[DEPURAÇÃO] Deletando avaliações (UsuAval) do usuário ${targetId}...`);
      await prisma.usuAval.deleteMany({
        where: { usuarioId: targetId }
      });

      console.log(`[DEPURAÇÃO] Deletando usuário ${targetId}...`);
      await prisma.usuario.delete({
        where: { id: targetId }
      });

      console.log(`[SUCESSO] Usuário ${targetId} e dados relacionados deletados.`);
      return res.status(200).json({ message: 'Usuário e dados relacionados deletados com sucesso.' });

    } catch (error) {
      console.error('[DeleteUsuarioController] Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  }
}
