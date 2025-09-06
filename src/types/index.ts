// Base com os campos comuns
interface BaseAniversariante {
  nome: string;
  data_nascimento: string; // agora está igual ao banco
  foto?: string;
  observacoes?: string;
  ministerio?: string; // se quiser já deixar reservado
}

// Usado quando já existe no sistema (com ID)
export interface Aniversariante extends BaseAniversariante {
  id: string;
}

// Usado para formulário de criação/edição (sem ID)
export type AniversarianteFormData = BaseAniversariante;
