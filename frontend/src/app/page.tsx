// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#A6A6A6]">
      {/* Cabeçalho com mensagem de boas-vindas */}
      <header className="py-12 text-center bg-[#A6A6A6]">
        <h1 className="text-6xl font-black text-black mb-4">Bem Vindo</h1>
        <p className="text-xl text-black">
          A plataforma estratégica para avaliações e insights transformadores
        </p>
      </header>

      {/* Conteúdo principal com fundo claro */}
      <main className="flex-1 bg-white p-12 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Para que serve o site?</h2>
            <p className="text-lg text-black">
              Nosso site foi desenvolvido para facilitar a realização de avaliações através de questionários dinâmicos, proporcionando feedbacks precisos e insights valiosos para a tomada de decisões estratégicas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Como funcionam as perguntas e os questionários?</h2>
            <p className="text-lg text-black">
              Cada questionário é composto por uma série de perguntas interativas que se adaptam conforme suas respostas. Utilizamos inteligência e personalização para oferecer uma experiência única e eficaz.
            </p>
          </section>

          <div className="text-center">
            <Link 
              href="/avaliacao"
              className="inline-block px-8 py-4 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition duration-300"
            >
              Iniciar Avaliação
            </Link>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-4 text-center text-black">
        &copy; {new Date().getFullYear()} Sistema de Avaliação. 
      </footer>
    </div>
  );
}
