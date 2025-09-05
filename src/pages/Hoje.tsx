import React, { useEffect, useState } from "react";
import { Aniversariante } from "../types";
import { supabase } from "../lib/supabase";
import { ehAniversarioHoje } from "../utils/dateUtils";
import toast from "react-hot-toast";

const Hoje: React.FC = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase.from("aniversariantes").select("*");

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar aniversariantes de hoje");
    } else {
      const mapped = data.map((a: any) => ({
        ...a,
        dataNascimento: a.data_nascimento,
      }));
      setAniversariantes(mapped as Aniversariante[]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.dataNascimento)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        🎂 Aniversariantes de Hoje
      </h1>

      {aniversariantesHoje.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Nenhum aniversariante hoje
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Volte amanhã para conferir!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aniversariantesHoje.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-6 text-white text-center">
                {a.foto ? (
                  <img
                    src={a.foto}
                    alt={a.nome}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold">
                      {a.nome.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mt-4">{a.nome}</h3>
                <p className="text-lg opacity-90">
                  {new Date().getFullYear() -
                    new Date(a.dataNascimento).getFullYear()}{" "}
                  anos hoje!
                </p>
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

export default Hoje;
