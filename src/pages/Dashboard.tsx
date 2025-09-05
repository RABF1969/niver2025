import React, { useState } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { gerarId, ehAniversarioHoje } from "../utils/dateUtils";
import AniversarianteTable from "../components/AniversarianteTable";
import AniversarianteForm from "../components/AniversarianteForm";
import { mockAniversariantes } from "../data/mockData";
import { Users, Cake, Calendar } from "lucide-react";

const Dashboard: React.FC = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>(mockAniversariantes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAniversariante, setEditingAniversariante] = useState<Aniversariante | undefined>();

  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.dataNascimento)
  );

  const handleSave = (formData: AniversarianteFormData) => {
    if (editingAniversariante) {
      // Editar
      setAniversariantes((prev) =>
        prev.map((a) =>
          a.id === editingAniversariante.id ? { ...a, ...formData } : a
        )
      );
    } else {
      // Criar novo
      const novoAniversariante: Aniversariante = {
        id: gerarId(),
        ...formData,
      };
      setAniversariantes((prev) => [...prev, novoAniversariante]);
    }

    setIsFormOpen(false);
    setEditingAniversariante(undefined);
  };

  const handleEdit = (aniversariante: Aniversariante) => {
    setEditingAniversariante(aniversariante);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setAniversariantes((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAniversariante(undefined);
  };

  const handleNovo = () => {
    setEditingAniversariante(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Aniversariantes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os aniversariantes da Igreja Ramá
          </p>
        </div>
        <button
          onClick={handleNovo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-md transition"
        >
          ➕ Novo Aniversariante
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Aniversariantes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {aniversariantes.length}
              </p>
            </div>
          </div>
        </div>

        {/* Hoje */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40">
              <Cake className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Aniversariantes Hoje
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {aniversariantesHoje.length}
              </p>
            </div>
          </div>
        </div>

        {/* Este mês */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/40">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Este Mês
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {aniversariantes.filter((a: Aniversariante) => {
                  const hoje = new Date();
                  const nascimento = new Date(a.dataNascimento);
                  return nascimento.getMonth() === hoje.getMonth();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destaque dos aniversariantes de hoje */}
      {aniversariantesHoje.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            🎉 Aniversariantes de Hoje
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aniversariantesHoje.map((aniversariante) => (
              <div
                key={aniversariante.id}
                className="bg-white/20 rounded-lg p-4 flex items-center"
              >
                {aniversariante.foto ? (
                  <img
                    src={aniversariante.foto}
                    alt={aniversariante.nome}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mr-3">
                    <span className="font-bold">
                      {aniversariante.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{aniversariante.nome}</p>
                  <p className="text-sm opacity-90">
                    {new Date().getFullYear() -
                      new Date(aniversariante.dataNascimento).getFullYear()}{" "}
                    anos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de aniversariantes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Todos os Aniversariantes
        </h2>
        <AniversarianteTable
          aniversariantes={aniversariantes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Formulário Modal */}
      <AniversarianteForm
        aniversariante={editingAniversariante}
        onSave={handleSave}
        onCancel={handleCancel}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default Dashboard;
