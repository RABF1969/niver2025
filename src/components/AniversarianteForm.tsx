import React, { useState, useEffect } from "react";
import { Aniversariante, AniversarianteFormData } from "../types";
import { X } from "lucide-react";

interface Props {
  aniversariante?: Aniversariante;
  onSave: (data: AniversarianteFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const AniversarianteForm: React.FC<Props> = ({
  aniversariante,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [formData, setFormData] = useState<AniversarianteFormData>({
    nome: "",
    dataNascimento: "",
    foto: "",
    observacoes: "",
  });

  useEffect(() => {
    if (aniversariante) {
      setFormData({
        nome: aniversariante.nome,
        dataNascimento: aniversariante.dataNascimento,
        foto: aniversariante.foto || "",
        observacoes: aniversariante.observacoes || "",
      });
    } else {
      setFormData({
        nome: "",
        dataNascimento: "",
        foto: "",
        observacoes: "",
      });
    }
  }, [aniversariante, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.dataNascimento) {
      onSave(formData);
      setFormData({
        nome: "",
        dataNascimento: "",
        foto: "",
        observacoes: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          foto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all scale-95 hover:scale-100 duration-200">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {aniversariante ? "✏️ Editar Aniversariante" : "➕ Novo Aniversariante"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite o nome completo"
            />
          </div>

          {/* Data de nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              required
              value={formData.dataNascimento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataNascimento: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {formData.foto && (
              <div className="mt-3 flex justify-center">
                <img
                  src={formData.foto}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover shadow-md border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ministério, cargo, informações adicionais..."
            />
          </div>

          {/* Ações */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AniversarianteForm;
