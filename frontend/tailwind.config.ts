import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // ESSENCIAL para ativar suporte ao tema escuro baseado em classe

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        // Fundos
        'page-bg': 'var(--color-background-page)',
        'element-bg': 'var(--color-background-element)',
        'card-bg': 'var(--card-background)',
        'input-bg': 'var(--input-background)',

        // Textos
        'text-base': 'var(--color-text-base)',
        'text-muted': 'var(--color-text-muted)',
        'on-primary': 'var(--color-text-on-primary)',

        // Cor Primária
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',

        // Bordas
        'main-border': 'var(--color-border)',
        'input-border': 'var(--color-border-input)',

        // Cores de Feedback
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',

        // Variáveis genéricas do tema
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },

      fontFamily: {
        sans: ['var(--font-family-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-family-mono)', 'ui-monospace', 'monospace'],
      },

      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },

      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
        'xl': 'var(--border-radius-xl)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'focus-ring': 'var(--shadow-focus-ring)',
      },
    },
  },

  plugins: [],
};

export default config;
