import React, { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { ehAniversarioHoje } from "../utils/dateUtils";
import AniversarianteTable from "../components/AniversarianteTable";
import AniversarianteForm from "../components/AniversarianteForm";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [filtered, setFiltered] = useState<Aniversariante[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAniversariante, setEditingAniversariante] = useState<
    Aniversariante | undefined
  >();

  // 🔹 Buscar aniversariantes no Supabase
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("aniversariantes")
      .select("*")
      .order("data_nascimento", { ascending: true });

    if (error) {
      console.error(error);
      toast.error("Erro ao carregar aniversariantes");
    } else {
      const mapped = data.map((a: any) => ({
        ...a,
        dataNascimento: a.data_nascimento,
      }));
      setAniversariantes(mapped as Aniversariante[]);
      setFiltered(mapped as Aniversariante[]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const aniversariantesHoje = filtered.filter((a) =>
    ehAniversarioHoje(a.dataNascimento)
  );

  // 🔹 Salvar (criar/editar)
  const handleSave = async (formData: AniversarianteFormData) => {
    const payload = {
      nome: formData.nome,
      data_nascimento: formData.dataNascimento,
      foto: formData.foto || null,
      observacoes: formData.observacoes || null,
    };

    if (editingAniversariante) {
      const { error } = await supabase
        .from("aniversariantes")
        .update(payload)
        .eq("id", editingAniversariante.id);

      if (error) toast.error("Erro ao editar aniversariante");
      else toast.success("✅ Aniversariante atualizado!");
    } else {
      const { error } = await supabase.from("aniversariantes").insert([payload]);
      if (error) toast.error("Erro ao cadastrar aniversariante");
      else toast.success("🎉 Novo aniversariante cadastrado!");
    }

    fetchData();
    setIsFormOpen(false);
    setEditingAniversariante(undefined);
  };

  const handleEdit = (aniversariante: Aniversariante) => {
    setEditingAniversariante(aniversariante);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("aniversariantes")
      .delete()
      .eq("id", id);

    if (error) toast.error("Erro ao excluir aniversariante");
    else {
      toast.success("🗑️ Aniversariante excluído");
      fetchData();
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAniversariante(undefined);
  };

  const handleNovo = () => {
    setEditingAniversariante(undefined);
    setIsFormOpen(true);
  };

  // 🔹 Filtros
  const handleFilterByName = (nome: string) => {
    if (!nome) {
      setFiltered(aniversariantes);
      return;
    }
    setFiltered(
      aniversariantes.filter((a) =>
        a.nome.toLowerCase().includes(nome.toLowerCase())
      )
    );
  };

  const handleFilterByMonth = (mes: string) => {
    if (!mes) {
      setFiltered(aniversariantes);
      return;
    }
    setFiltered(
      aniversariantes.filter(
        (a) => new Date(a.dataNascimento).getMonth() + 1 === Number(mes)
      )
    );
  };

  const handleResetFilters = () => {
    setFiltered(aniversariantes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard de Aniversariantes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os aniversariantes da Igreja Ramá
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchData}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors shadow"
          >
            🔄 Recarregar
          </button>
          <button
            onClick={handleNovo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            ➕ Novo Aniversariante
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Buscar por nome"
          onChange={(e) => handleFilterByName(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />

        <select
          onChange={(e) => handleFilterByMonth(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="">📅 Mês</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>

        <button
          onClick={handleResetFilters}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors shadow"
        >
          🔄 Resetar Filtros
        </button>
      </div>

      {/* Cards estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de Aniversariantes
          </p>
          <p className="text-2xl font-semibold">{filtered.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aniversariantes Hoje
          </p>
          <p className="text-2xl font-semibold">{aniversariantesHoje.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Este mês</p>
          <p className="text-2xl font-semibold">
            {
              filtered.filter((a) => {
                const hoje = new Date();
                const nascimento = new Date(a.dataNascimento);
                return nascimento.getMonth() === hoje.getMonth();
              }).length
            }
          </p>
        </div>
      </div>

      {/* Destaque dos aniversariantes de hoje */}
      {aniversariantesHoje.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🎉 Aniversariantes de Hoje</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aniversariantesHoje.map((a) => (
              <div
                key={a.id}
                className="bg-white/20 rounded-lg p-4 flex items-center"
              >
                {a.foto ? (
                  <img
                    src={a.foto}
                    alt={a.nome}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mr-3">
                    <span className="font-bold">
                      {a.nome.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{a.nome}</p>
                  <p className="text-sm opacity-90">
                    {new Date().getFullYear() -
                      new Date(a.dataNascimento).getFullYear()}{" "}
                    anos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela */}
      <AniversarianteTable
        aniversariantes={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
