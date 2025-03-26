// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-900 to-blue-500">
      {/* Cabeçalho com mensagem de boas-vindas */}
      <header className="py-12 text-center">
        <h1 className="text-6xl font-black text-white mb-4">Bem Vindo</h1>
        <p className="text-xl text-blue-100">
          A plataforma estratégica para avaliações e insights transformadores
        </p>
      </header>

      {/* Conteúdo principal com fundo branco em tom suave */}
      <main className="flex-1 bg-white rounded-t-3xl p-12 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Para que serve o site?</h2>
            <p className="text-lg text-gray-700">
              Nosso site foi desenvolvido para facilitar a realização de avaliações através de questionários dinâmicos, proporcionando feedbacks precisos e insights valiosos para a tomada de decisões estratégicas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Como funcionam as perguntas e os questionários?</h2>
            <p className="text-lg text-gray-700">
              Cada questionário é composto por uma série de perguntas interativas que se adaptam conforme suas respostas. Utilizamos inteligência e personalização para oferecer uma experiência única e eficaz.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Sobre Nós</h2>
            <p className="text-lg text-gray-700">
              Somos uma equipe apaixonada por inovação e tecnologia. Nosso objetivo é fornecer soluções robustas que auxiliem empresas e profissionais a obter insights estratégicos, impulsionando o sucesso e a eficiência.
            </p>
          </section>

          <div className="text-center">
            <Link 
              href="/avaliacao"
              className="inline-block px-8 py-4 bg-blue-900 text-white text-lg font-semibold rounded-full hover:bg-blue-800 transition duration-300"
            >
              Iniciar Avaliação
            </Link>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-4 text-center text-blue-100">
        &copy; {new Date().getFullYear()} Sistema de Avaliação. Todos os direitos reservados.
      </footer>
    </div>
  );
}
