// Base com os campos comuns
interface BaseAniversariante {
  nome: string;
  dataNascimento: string; // pode ser string (ISO) ou Date
  foto?: string;
  observacoes?: string;
}

// Usado quando já existe no sistema (com ID)
export interface Aniversariante extends BaseAniversariante {
  id: string;
}

// Usado para formulário de criação/edição (sem ID)
export type AniversarianteFormData = BaseAniversariante;
