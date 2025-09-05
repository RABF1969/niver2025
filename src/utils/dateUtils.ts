// utils/dateUtils.ts

// 🔧 Função auxiliar para normalizar string de data
const parseDate = (data: string): Date => {
  // Caso venha no formato DD/MM/YYYY → converter para YYYY-MM-DD
  if (data.includes("/")) {
    const [dia, mes, ano] = data.split("/");
    return new Date(`${ano}-${mes}-${dia}T00:00:00`);
  }
  // Caso já esteja no formato ISO (YYYY-MM-DD)
  return new Date(data + "T00:00:00");
};

export const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = parseDate(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
};

export const formatarData = (data: string): string => {
  const dataObj = parseDate(data);
  return dataObj.toLocaleDateString("pt-BR");
};

export const ehAniversarioHoje = (dataNascimento: string): boolean => {
  const hoje = new Date();
  const nascimento = parseDate(dataNascimento);

  return (
    hoje.getMonth() === nascimento.getMonth() &&
    hoje.getDate() === nascimento.getDate()
  );
};

export const gerarId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
