import React, { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { uploadImage } from "../utils/uploadImage"; // 🔹 Utilitário que envia imagens pro Supabase

interface Props {
  aniversariante?: Aniversariante; // Caso esteja editando, recebe o aniversariante atual
  onSave: (data: AniversarianteFormData) => void; // Função chamada ao salvar
  onCancel: () => void; // Função chamada ao cancelar
  isOpen: boolean; // Controla se o modal está aberto
}

const AniversarianteForm: React.FC<Props> = ({
  aniversariante,
  onSave,
  onCancel,
  isOpen,
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<AniversarianteFormData>({
    nome: "",
    data_nascimento: "",
    foto: "",
    observacoes: "",
  });

  // Estado para mostrar carregamento durante o upload
  const [uploading, setUploading] = useState(false);

  /**
   * Atualiza os campos quando:
   * - Editando um aniversariante existente
   * - Criando um novo aniversariante (limpa os campos)
   */
  useEffect(() => {
    if (aniversariante) {
      setFormData({
        nome: aniversariante.nome,
        data_nascimento: aniversariante.data_nascimento,
        foto: aniversariante.foto || "",
        observacoes: aniversariante.observacoes || "",
      });
    } else {
      setFormData({
        nome: "",
        data_nascimento: "",
        foto: "",
        observacoes: "",
      });
    }
  }, [aniversariante, isOpen]);

  /**
   * Salva os dados do formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.data_nascimento) {
      onSave(formData); // 🔹 Envia pro backend ou serviço de persistência
    }
  };

  /**
   * Faz o upload da imagem no Supabase Storage
   * e atualiza o campo `foto` com a URL pública
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      // 🔹 Usa nosso utilitário que já comprime e faz upload no Supabase
      const url = await uploadImage(file);

      if (url) {
        setFormData((prev) => ({
          ...prev,
          foto: url, // 🔹 Salva a URL pública no form
        }));
      }

      setUploading(false);
    }
  };

  // Se o modal não estiver aberto → não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Título do modal */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {aniversariante ? "Editar Aniversariante" : "Novo Aniversariante"}
          </h2>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Digite o nome completo"
              />
            </div>

            {/* Data de nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Nascimento *
              </label>
              <input
                type="date"
                required
                value={formData.data_nascimento}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    data_nascimento: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Foto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Feedback de upload */}
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">Enviando foto...</p>
              )}

              {/* Preview da imagem */}
              {formData.foto && !uploading && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={formData.foto}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ministério, cargo, informações adicionais..."
              />
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AniversarianteForm;
