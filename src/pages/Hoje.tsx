import React, { useState, useEffect } from 'react';
import { Aniversariante } from '../types';
import { ehAniversarioHoje, calcularIdade } from '../utils/dateUtils';
import { supabase } from '../lib/supabase';

const Hoje: React.FC = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAniversariantes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('aniversariantes')
        .select('*')
        .order('data_nascimento', { ascending: true });

      if (!error && data) {
        setAniversariantes(data);
      }
      setLoading(false);
    };

    fetchAniversariantes();
  }, []);

  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.data_nascimento)
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Carregando aniversariantes...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        🎂 Aniversariantes de Hoje
      </h1>

      {aniversariantesHoje.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Nenhum aniversariante hoje
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {aniversariantesHoje.map((aniversariante) => (
            <div
              key={aniversariante.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {aniversariante.foto ? (
                  <img
                    src={aniversariante.foto}
                    alt={aniversariante.nome}
                    className="w-24 h-24 rounded-full object-cover mb-4 shadow"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow">
                    {aniversariante.nome
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {aniversariante.nome}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {calcularIdade(aniversariante.data_nascimento)} anos
                </p>
                {aniversariante.observacoes && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {aniversariante.observacoes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hoje;
