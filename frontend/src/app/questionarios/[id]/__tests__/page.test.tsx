// frontend/src/app/questionarios/[id]/__tests__/page.test.tsx

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionarioPage from '../page'; // O componente que vamos testar
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/menu/ThemeProvider';
import api from '@/services/api';

// Simula (mock) a API
jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Simula (mock) os hooks do Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: '132', // Fornecemos um ID de questionário falso para os testes
  }),
  useSearchParams: jest.fn(),
}));

// Helper para renderizar o componente com os contextos necessários
const renderComponent = () => {
  return render(
    <AuthProvider>
      <ThemeProvider>
        <QuestionarioPage />
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('Página do Questionário', () => {

  // Limpa os mocks após cada teste para garantir que um não interfira no outro
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste 1: Cenário de Carregamento
  it('deve exibir a mensagem de "Carregando" inicialmente', () => {
    renderComponent();
    expect(screen.getByText(/carregando dados do questionário/i)).toBeInTheDocument();
  });

  // Teste 2: Cenário de Sucesso
  it('deve exibir o título do questionário após o carregamento bem-sucedido', async () => {
    // Prepara a resposta falsa da API
    const mockData = {
      titulo: 'Questionário de Teste Mock',
      perguntas: [],
      avaliacoes: [],
    };
    mockedApi.get.mockResolvedValue({ data: mockData });

    renderComponent();

    // Espera até que o título apareça na tela
    await waitFor(() => {
      expect(screen.getByText(/Editando Questionário: Questionário de Teste Mock/i)).toBeInTheDocument();
    });

    // Verifica se a API foi chamada corretamente
    expect(mockedApi.get).toHaveBeenCalledWith('/questionarios/132');
  });

  // Teste 3: Cenário de Erro
  it('deve exibir uma mensagem de erro se a API falhar', async () => {
    // Simula uma falha na API
    mockedApi.get.mockRejectedValue(new Error('Falha na API'));

    renderComponent();

    // Espera a mensagem de erro aparecer
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar os dados. Tente novamente./i)).toBeInTheDocument();
    });
  });

  // Teste 4: Teste de Interação
  it('deve mudar para a visão de "Análise" ao clicar no botão do dashboard', async () => {
    const user = userEvent.setup();
    mockedApi.get.mockResolvedValue({ data: { titulo: 'Teste', perguntas: [] } }); // Resposta básica para carregar a página
    
    renderComponent();
    
    // Aguarda o carregamento inicial
    await waitFor(() => screen.getByText(/Editando Questionário:/i));

    // Encontra o botão "Análise / Dashboard" e clica nele
    const dashboardButton = screen.getByRole('button', { name: /Análise \/ Dashboard/i });
    await act(async () => {
        await user.click(dashboardButton);
    });

    // Verifica se o título da seção de análise apareceu
    await waitFor(() => {
      expect(screen.getByText(/Análise do Questionário:/i)).toBeInTheDocument();
    });
  });

});