import React, { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { ehAniversarioHoje } from "../utils/dateUtils";
import AniversarianteTable from "../components/AniversarianteTable";
import AniversarianteForm from "../components/AniversarianteForm";
import { supabase } from "../lib/supabase";
import { Toaster, toast } from "react-hot-toast";

const Dashboard: React.FC = () => {
  // Removido: const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAniversariante, setEditingAniversariante] = useState<Aniversariante | undefined>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mesFiltro, setMesFiltro] = useState<string>("");
  const [limit, setLimit] = useState<number>(5);
  const [allAniversariantes, setAllAniversariantes] = useState<Aniversariante[]>([]);

  // Buscar aniversariantes no Supabase
  useEffect(() => {
    const fetchAniversariantes = async () => {
      try {
        const { data, error } = await supabase
          .from("aniversariantes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setAllAniversariantes(data || []);
        // Removido: setAniversariantes((data || []).slice(0, limit));
      } catch (err) {
        console.error("❌ Erro ao carregar aniversariantes:", err);
        toast.error("Erro ao carregar aniversariantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAniversariantes();
  }, [limit]);

  // Handlers CRUD
  const handleSave = async (formData: AniversarianteFormData) => {
    try {
      if (editingAniversariante) {
        const { error } = await supabase
          .from("aniversariantes")
          .update(formData)
          .eq("id", editingAniversariante.id);

        if (error) throw error;

        setAllAniversariantes((prev) =>
          prev.map((a) =>
            a.id === editingAniversariante.id ? { ...a, ...formData } : a
          )
        );
        toast.success("Aniversariante atualizado com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("aniversariantes")
          .insert([formData])
          .select();

        if (error) throw error;

        if (data) setAllAniversariantes((prev) => [...data, ...prev]);
        toast.success("Aniversariante cadastrado com sucesso!");
      }
      setIsFormOpen(false);
      setEditingAniversariante(undefined);
    } catch (err) {
      console.error("❌ Erro ao salvar aniversariante:", err);
      toast.error("Erro ao salvar aniversariante.");
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

      setAllAniversariantes((prev) => prev.filter((a) => a.id !== id));
      toast.success("Aniversariante excluído com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao excluir aniversariante:", err);
      toast.error("Erro ao excluir aniversariante.");
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

  // Filtros aplicados
  const aniversariantesFiltrados = allAniversariantes
    .filter((a) => {
      const nomeMatch = a.nome.toLowerCase().includes(search.toLowerCase());
      const mesMatch =
        !mesFiltro ||
        new Date(a.data_nascimento).getMonth().toString() === mesFiltro;
      return nomeMatch && mesMatch;
    })
    .slice(0, limit);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-300">
        Carregando aniversariantes...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />

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
        <button
          onClick={handleNovo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          ➕ Novo Aniversariante
        </button>
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de Aniversariantes
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {allAniversariantes.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aniversariantes Hoje
          </p>
          <p className="text-2xl font-bold text-green-600">
            {allAniversariantes.filter((a) => ehAniversarioHoje(a.data_nascimento)).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Este mês</p>
          <p className="text-2xl font-bold text-purple-600">
            {
              allAniversariantes.filter(
                (a) => new Date(a.data_nascimento).getMonth() === new Date().getMonth()
              ).length
            }
          </p>
        </div>
      </div>

      {/* Tabela */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        📌 Últimos Aniversariantes Cadastrados
      </h2>
      <AniversarianteTable
        aniversariantes={aniversariantesFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Controle de exibição */}
      <div className="mt-4 flex justify-end">
        <label className="text-sm text-gray-700 dark:text-gray-300 mr-2">
          Mostrar:
        </label>
        <select
          value={limit === allAniversariantes.length ? "all" : limit}
          onChange={(e) =>
            setLimit(e.target.value === "all" ? allAniversariantes.length : Number(e.target.value))
          }
          className="px-3 py-1 rounded-md border dark:bg-gray-800 dark:border-gray-600"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value="all">Todos</option>
        </select>
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
