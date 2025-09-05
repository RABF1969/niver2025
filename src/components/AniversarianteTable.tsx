import React from "react";
import { Aniversariante } from "../types";
import { calcularIdade, formatarData } from "../utils/dateUtils";
import { Pencil, Trash2, Info } from "lucide-react";

interface Props {
  aniversariantes: Aniversariante[];
  onEdit: (aniversariante: Aniversariante) => void;
  onDelete: (id: string) => void;
}

const AniversarianteTable: React.FC<Props> = ({
  aniversariantes,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      onDelete(id);
    }
  };

  // Função para criar badge colorida com base no ministério
  const getBadgeColor = (observacao?: string) => {
    if (!observacao) return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    if (observacao.toLowerCase().includes("louvor"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (observacao.toLowerCase().includes("infantil"))
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
    if (observacao.toLowerCase().includes("intercessão"))
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (observacao.toLowerCase().includes("pastor"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Data de Nascimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Idade
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {aniversariantes.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {/* Foto */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {a.foto ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={a.foto}
                      alt={a.nome}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {a.nome.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </span>
                    </div>
                  )}
                </td>

                {/* Nome + Observação */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {a.nome}
                  </div>
                  {a.observacoes && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getBadgeColor(
                        a.observacoes
                      )}`}
                    >
                      <Info className="w-3 h-3 mr-1" />
                      {a.observacoes}
                    </span>
                  )}
                </td>

                {/* Data de nascimento */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatarData(a.dataNascimento)}
                </td>

                {/* Idade */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {calcularIdade(a.dataNascimento)} anos
                </td>

                {/* Ações */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(a)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm transition"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.nome)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-sm transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Estado vazio */}
        {aniversariantes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🎂</div>
              <p className="text-lg font-medium">Nenhum aniversariante cadastrado</p>
              <p className="text-sm">Clique em "Novo Aniversariante" para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AniversarianteTable;
