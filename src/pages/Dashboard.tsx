import { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { ehAniversarioHoje } from "../utils/dateUtils";
import AniversarianteTable from "../components/AniversarianteTable";
import AniversarianteForm from "../components/AniversarianteForm";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { deleteImage } from "../utils/deleteImage"; // 🔹 vamos excluir a foto do Storage

const Dashboard = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAniversariante, setEditingAniversariante] = useState<Aniversariante | undefined>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mesFiltro, setMesFiltro] = useState<string>("");
  const [limit, setLimit] = useState<number>(5); // 🔹 limite inicial da tabela

  /**
   * Carrega aniversariantes do banco
   */
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
        toast.error("Erro ao carregar aniversariantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAniversariantes();
  }, []);

  // 🔎 Aniversariantes do dia
  const aniversariantesHoje = aniversariantes.filter((a) =>
    ehAniversarioHoje(a.data_nascimento)
  );

  /**
   * Cria/atualiza aniversariante
   */
  const handleSave = async (formData: AniversarianteFormData) => {
    try {
      if (editingAniversariante) {
        // ✏️ Atualização
        const { error } = await supabase
          .from("aniversariantes")
          .update(formData)
          .eq("id", editingAniversariante.id);

        if (error) throw error;

        setAniversariantes((prev) =>
          prev.map((a) => (a.id === editingAniversariante.id ? { ...a, ...formData } : a))
        );
        toast.success("✏️ Aniversariante atualizado com sucesso!");
      } else {
        // ➕ Inserção
        const { data, error } = await supabase
          .from("aniversariantes")
          .insert([formData])
          .select();

        if (error) throw error;

        if (data) {
          setAniversariantes((prev) => [...prev, ...data]);
          toast.success("✅ Aniversariante cadastrado com sucesso!");
        }
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

  /**
   * Exclui aniversariante:
   * 1) tenta remover a foto do Storage (se existir)
   * 2) remove o registro do banco
   * 3) atualiza a lista local
   */
  const handleDelete = async (id: string, foto?: string) => {
    try {
      // 1) Remover a imagem do Storage (se tiver URL)
      if (foto && foto.trim() !== "") {
        const ok = await deleteImage(foto);
        if (!ok) {
          // Não vamos bloquear a exclusão do registro se a remoção do arquivo falhar,
          // apenas avisamos. Assim o banco não fica com lixo.
          toast.warn("Atenção: não foi possível remover a foto no Storage.");
        }
      }

      // 2) Remover o registro no banco
      const { error } = await supabase.from("aniversariantes").delete().eq("id", id);
      if (error) throw error;

      // 3) Atualizar o estado local
      setAniversariantes((prev) => prev.filter((a) => a.id !== id));
      toast.info("🗑️ Aniversariante excluído com sucesso!");
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

  // 🧮 Filtros (nome + mês)
  const aniversariantesFiltrados = aniversariantes.filter((a) => {
    const nomeMatch = a.nome.toLowerCase().includes(search.toLowerCase());
    const mesMatch =
      !mesFiltro || new Date(a.data_nascimento).getMonth().toString() === mesFiltro;
    return nomeMatch && mesMatch;
  });

  // 🔢 Limite de linhas exibidas
  const aniversariantesLimitados = aniversariantesFiltrados.slice(-limit);

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

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Aniversariantes</p>
          <p className="text-2xl font-bold text-blue-600">{aniversariantes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Aniversariantes Hoje</p>
          <p className="text-2xl font-bold text-green-600">{aniversariantesHoje.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Este mês</p>
          <p className="text-2xl font-bold text-purple-600">
            {aniversariantes.filter(
              (a) => new Date(a.data_nascimento).getMonth() === new Date().getMonth()
            ).length}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <AniversarianteTable
        aniversariantes={aniversariantesLimitados}
        onEdit={handleEdit}
        onDelete={handleDelete} // 🔹 agora recebe (id, foto?)
      />

      {/* Controle de exibição */}
      <div className="mt-4 flex justify-end space-x-2">
        {[5, 10, 50, 100, aniversariantesFiltrados.length].map((n, i) => (
          <button
            key={i}
            onClick={() => setLimit(n)}
            className={`px-3 py-1 rounded ${
              limit === n ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {n === aniversariantesFiltrados.length ? "Todos" : n}
          </button>
        ))}
      </div>

      {/* Modal de formulário */}
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
