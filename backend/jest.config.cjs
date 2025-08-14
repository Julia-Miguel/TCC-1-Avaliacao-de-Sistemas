// backend/jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  // Arquivo que vai preparar e limpar a base de dados
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testMatch: ['**/*.spec.js'],
};