import React, { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { calcularIdade, ehAniversarioHoje } from "../utils/dateUtils";
import AniversarianteTable from "../components/AniversarianteTable";
import AniversarianteForm from "../components/AniversarianteForm";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAniversariante, setEditingAniversariante] = useState<Aniversariante | undefined>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mesFiltro, setMesFiltro] = useState<string>("");
  const [limit, setLimit] = useState<number>(5); // limite de registros exibidos

  // Buscar aniversariantes no Supabase
  useEffect(() => {
    const fetchAniversariantes = async () => {
      try {
        const { data, error } = await supabase
          .from("aniversariantes")
          .select("*")
          .order("data_nascimento", { ascending: true });

        if (error) throw error;

        setAniversariantes(data || []);
      } catch (err) {
        console.error("❌ Erro ao carregar aniversariantes:", err);
        toast.error("Erro ao carregar aniversariantes!");
      } finally {
        setLoading(false);
      }
    };

    fetchAniversariantes();
  }, []);

  // Aniversariantes de hoje
  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.data_nascimento)
  );

  // Handlers CRUD
  const handleSave = async (formData: AniversarianteFormData) => {
    try {
      if (editingAniversariante) {
        const { error } = await supabase
          .from("aniversariantes")
          .update(formData)
          .eq("id", editingAniversariante.id);

        if (error) throw error;

        setAniversariantes((prev) =>
          prev.map((a) =>
            a.id === editingAniversariante.id ? { ...a, ...formData } : a
          )
        );

        toast.success("✏️ Aniversariante atualizado com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("aniversariantes")
          .insert([formData])
          .select();

        if (error) throw error;

        if (data) setAniversariantes((prev) => [...prev, ...data]);

        toast.success("🎉 Aniversariante cadastrado com sucesso!");
      }
      setIsFormOpen(false);
      setEditingAniversariante(undefined);
    } catch (err) {
      console.error("❌ Erro ao salvar aniversariante:", err);
      toast.error("Erro ao salvar aniversariante!");
    }
  };

  const handleEdit = (aniversariante: Aniversariante) => {
    setEditingAniversariante(aniversariante);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("aniversariantes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAniversariantes((prev) => prev.filter((a) => a.id !== id));
      toast.success("🗑️ Aniversariante excluído com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao excluir aniversariante:", err);
      toast.error("Erro ao excluir aniversariante!");
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

  const handleResetFiltros = () => {
    setSearch("");
    setMesFiltro("");
  };

  // Aplicar filtros
  const aniversariantesFiltrados = aniversariantes.filter((a) => {
    const nomeMatch = a.nome.toLowerCase().includes(search.toLowerCase());
    const mesMatch =
      !mesFiltro || new Date(a.data_nascimento).getMonth().toString() === mesFiltro;
    return nomeMatch && mesMatch;
  });

  // Pegar somente os últimos cadastrados
  const aniversariantesLimitados = aniversariantesFiltrados.slice(
    Math.max(aniversariantesFiltrados.length - limit, 0)
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-300">
        Carregando aniversariantes...
      </div>
    );
  }

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
        <div className="flex gap-3">
          <button
            onClick={handleNovo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            ➕ Novo Aniversariante
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        />
        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">📅 Mês</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i.toString()}>
              {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
            </option>
          ))}
        </select>
        <button
          onClick={handleResetFiltros}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Resetar Filtros
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de Aniversariantes
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {aniversariantes.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aniversariantes Hoje
          </p>
          <p className="text-2xl font-bold text-green-600">
            {aniversariantesHoje.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Este mês</p>
          <p className="text-2xl font-bold text-purple-600">
            {
              aniversariantes.filter(
                (a) =>
                  new Date(a.data_nascimento).getMonth() === new Date().getMonth()
              ).length
            }
          </p>
        </div>
      </div>

      {/* Tabela */}
      <AniversarianteTable
        aniversariantes={aniversariantesLimitados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Controle de exibição */}
      <div className="flex justify-end mt-4 gap-2">
        {[5, 10, 50, 100, aniversariantesFiltrados.length].map((num) => (
          <button
            key={num}
            onClick={() => setLimit(num)}
            className={`px-3 py-1 rounded-md ${
              limit === num
                ? "bg-blue-500 text-white"
                : "bg-gray-300 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {num === aniversariantesFiltrados.length ? "Todos" : num}
          </button>
        ))}
      </div>

      {/* Formulário */}
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
