// frontend/src/app/(auth-empresa)/admin/login/__tests__/page.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { ThemeProvider } from '@/components/menu/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  // 👇 ATUALIZAMOS ESTE MOCK PARA SIMULAR UMA URL VÁLIDA
  useSearchParams: () => (
    new URLSearchParams({
      empresaId: '123-id-falso',
      empresaNome: 'Empresa de Teste'
    })
  ),
}));

// Helper para renderizar com os providers
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {component}
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('Página de Login do Admin', () => {

  it('deve renderizar os campos de email, senha e o botão de entrar', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/Email do usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar como Admin/i })).toBeInTheDocument();
  });

  it('deve permitir que o usuário digite nos campos de email e senha', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email do usuário/i);
    const passwordInput = screen.getByLabelText(/Senha/i);

    // Verifica que os campos não estão desabilitados
    expect(emailInput).not.toBeDisabled();
    expect(passwordInput).not.toBeDisabled();

    await user.type(emailInput, 'admin@teste.com');
    await user.type(passwordInput, 'senha123');

    expect(emailInput).toHaveValue('admin@teste.com');
    expect(passwordInput).toHaveValue('senha123');
  });
});