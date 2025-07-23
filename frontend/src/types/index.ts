// Define um tipo unificado para o administrador logado
export interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN_EMPRESA';
  empresaId: number;
}