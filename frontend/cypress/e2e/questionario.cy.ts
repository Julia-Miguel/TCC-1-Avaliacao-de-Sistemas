// cypress/e2e/questionario.cy.ts

describe('Fluxo de Análise do Questionário com Login Duplo', () => {

  it('deve permitir o login da empresa, depois do admin, e navegar até a análise', () => {
    
    // --- ETAPA 1: LOGIN DA EMPRESA ---
    cy.visit('/empresas/login');
    cy.get('#email-responsavel').type('empresa@gmail.com');
    cy.get('#senha-empresa').type('123');
    cy.get('button[type="submit"]').click();

    // --- ETAPA 2: LOGIN DO ADMINISTRADOR ---
    cy.get('#admin-email').should('be.visible');
    cy.get('#admin-email').type('t@gmail.com');
    cy.get('#admin-senha').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // --- ETAPA 3: NAVEGAÇÃO ATÉ AO QUESTIONÁRIO ---
    cy.visit('/questionarios');

    // 👇 USANDO O SEU NOVO SELETOR ESPECÍFICO 👇
    const seletorDoCard = '.md\\:flex > .flex-col > .flex-1 > .p-4 > .page-container > .questionarios-grid > :nth-child(3) > .questionario-card > .card-header > .title-container > .btn > .flex > .truncate';
    
    cy.get(seletorDoCard).click();

    // Verifica se a URL mudou para a página de detalhes
    cy.url().should('include', '/questionarios/');

    // Clica na aba de Análise
    cy.contains('button', 'Análise / Dashboard').click();

    // Verifica se o dashboard de análise foi carregado
    cy.contains('h3', 'Análise do Questionário').should('be.visible');
    cy.contains('div', 'Total de Avaliações').should('be.visible');
  });

});