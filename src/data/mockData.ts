// data/mockData.ts
import { Aniversariante } from "../types";

export const mockAniversariantes: Aniversariante[] = [
  {
    id: "1",
    nome: "Maria Silva",
    dataNascimento: "15/03/1985", // DD/MM/YYYY
    foto: "https://images.unsplash.com/photo-1494790108755-2616b612b510?w=150&h=150&fit=crop&crop=face",
    observacoes: "Líder do ministério de louvor",
  },
  {
    id: "2",
    nome: "João Santos",
    dataNascimento: "22/07/1990",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    observacoes: "Pastor auxiliar",
  },
  {
    id: "3",
    nome: "Ana Costa",
    dataNascimento: "08/12/1992",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    observacoes: "Coordenadora do ministério infantil",
  },
  {
    id: "4",
    nome: "Pedro Oliveira",
    dataNascimento: "30/05/1988",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    observacoes: "Ministério de intercessão",
  },
  {
    id: "5",
    nome: "Lucia Ferreira",
    dataNascimento: "04/09/1995", // 👈 se hoje for 04/09, ela deve aparecer como aniversariante do dia
    foto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    observacoes: "Secretária da igreja",
  },
];
