import React from "react";
import { Aniversariante } from "../types";
import { calcularIdade, formatarData } from "../utils/dateUtils";
import AvatarFallback from "./AvatarFallback";

interface Props {
  aniversariantes: Aniversariante[];
  onEdit: (aniversariante: Aniversariante) => void;
  onDelete: (id: string, foto?: string) => void; 
  // 🔹 Agora onDelete recebe também a foto (opcional)
}

const AniversarianteTable: React.FC<Props> = ({
  aniversariantes,
  onEdit,
  onDelete,
}) => {
  /**
   * Confirmação antes de excluir
   * Agora passamos também a URL da foto para o onDelete
   */
  const handleDelete = (id: string, nome: string, foto?: string) => {
    if (window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      onDelete(id, foto); 
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data de Nascimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Idade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {aniversariantes.map((aniversariante) => (
              <tr
                key={aniversariante.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Foto */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-12 w-12">
                    {aniversariante.foto && aniversariante.foto.trim() !== "" ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover shadow-md"
                        src={aniversariante.foto}
                        alt={aniversariante.nome}
                      />
                    ) : (
                      <AvatarFallback nome={aniversariante.nome} size="md" />
                    )}
                  </div>
                </td>

                {/* Nome + Observações */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {aniversariante.nome}
                  </div>
                  {aniversariante.observacoes && (
                    <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {aniversariante.observacoes}
                    </span>
                  )}
                </td>

                {/* Data de nascimento */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatarData(aniversariante.data_nascimento)}
                </td>

                {/* Idade */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {calcularIdade(aniversariante.data_nascimento)} anos
                </td>

                {/* Ações */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(aniversariante)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Editar"
                    >
                      ✎ Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(aniversariante.id, aniversariante.nome, aniversariante.foto)
                      }
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Excluir"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mensagem caso não tenha aniversariantes */}
        {aniversariantes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🎂</div>
              <p className="text-lg font-medium">
                Nenhum aniversariante cadastrado
              </p>
              <p className="text-sm">Clique em "Novo Aniversariante" para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AniversarianteTable;
