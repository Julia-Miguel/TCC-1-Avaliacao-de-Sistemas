// frontend/jest.config.js

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Forneça o caminho para a sua aplicação Next.js para carregar next.config.js e .env em seu ambiente de teste
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)