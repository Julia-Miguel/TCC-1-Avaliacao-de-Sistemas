// cypress/e2e/login.cy.ts

// Descrição corrigida para refletir o teste real
describe('Fluxo de Login da Empresa', () => {
  it('deve permitir que uma empresa faça login e seja redirecionada', () => {
    
    cy.visit('/empresas/login');

    // 👇 SELETORES CORRIGIDOS COM BASE NA SUA IMAGEM 👇
    const emailSelector = '#email-responsavel'; 
    const senhaSelector = '#senha-empresa'; 

    // O comando cy.pause() não é mais necessário, pode remover ou deixar comentado
    // cy.pause(); 

    cy.get(emailSelector).should('be.visible');
    cy.get(senhaSelector).should('exist');

    // IMPORTANTE: Use o email e a senha de uma EMPRESA de teste que exista no seu banco
    cy.get(emailSelector).type('empresa@gmail.com');
    cy.get(senhaSelector).type('123');
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').click();
    cy.get(emailSelector).type('t@gmail.com');
    cy.get(senhaSelector).type('123456');
    
    // Verifique se o login redirecionou para a página correta (provavelmente o dashboard)
    cy.url().should('include', '/dashboard');
    cy.contains('h1', 'Dashboard').should('be.visible');
  });
});