import React from "react";
import { Aniversariante } from "../types";
import { calcularIdade } from "../utils/dateUtils";

interface Props {
  aniversariantes: Aniversariante[];
  onRefresh?: () => void; // 🔹 Nova prop opcional
}

const AniversariantesDoDia: React.FC<Props> = ({ aniversariantes, onRefresh }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
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

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow transition-colors"
          >
            🔄 Atualizar Lista
          </button>
        )}
      </div>

      {aniversariantes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum aniversariante hoje
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Que tal voltar amanhã para conferir?
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aniversariantes.map((aniversariante) => (
            <div
              key={aniversariante.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              {aniversariante.foto ? (
                <img
                  src={aniversariante.foto}
                  alt={aniversariante.nome}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-500 shadow-md mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-4 border-blue-500 shadow-md mb-4">
                  <span className="text-2xl font-bold text-gray-700 dark:text-white">
                    {aniversariante.nome.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {aniversariante.nome}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {calcularIdade(aniversariante.dataNascimento)} anos hoje 🎂
              </p>
              {aniversariante.observacoes && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {aniversariante.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AniversariantesDoDia;
