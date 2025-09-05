import React from "react";
import { Aniversariante } from "../types";
import { calcularIdade, ehAniversarioHoje } from "../utils/dateUtils";
import { Gift, Image } from "lucide-react";

interface Props {
  aniversariantes: Aniversariante[];
}

const AniversariantesDoDia: React.FC<Props> = ({ aniversariantes }) => {
  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.dataNascimento)
  );

  const gerarFlyer = (aniversariante: Aniversariante) => {
    console.log(`Gerar flyer para ${aniversariante.nome}`);
    alert(`(Futuro recurso) Gerar flyer para ${aniversariante.nome}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Aniversariantes de Hoje
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {aniversariantesHoje.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum aniversariante hoje
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Volte amanhã e veja quem estará em festa 🎂
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aniversariantesHoje.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center text-white">
                {a.foto ? (
                  <img
                    src={a.foto}
                    alt={a.nome}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-white/20 flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-2xl font-bold">
                      {a.nome.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                )}

                <h3 className="mt-4 text-xl font-bold">{a.nome}</h3>
                <p className="opacity-90">{calcularIdade(a.dataNascimento)} anos hoje!</p>
              </div>

              <div className="p-6">
                {a.observacoes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    {a.observacoes}
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={() => gerarFlyer(a)}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-md"
                  >
                    <Image className="w-4 h-4" />
                    Gerar Flyer
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🎈 Parabéns pelo seu dia especial!
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AniversariantesDoDia;
