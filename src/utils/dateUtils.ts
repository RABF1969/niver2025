export const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const [ano, mes, dia] = dataNascimento.split("-").map(Number);

  let idade = hoje.getFullYear() - ano;

  // Ajusta se ainda não fez aniversário este ano
  if (
    mes - 1 > hoje.getMonth() ||
    (mes - 1 === hoje.getMonth() && dia > hoje.getDate())
  ) {
    idade--;
  }

  return idade;
};

export const formatarData = (data: string): string => {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export const ehAniversarioHoje = (dataNascimento: string): boolean => {
  if (!dataNascimento) return false;

  const [ano, mes, dia] = dataNascimento.split("-").map(Number);

  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth() + 1; // getMonth() começa em 0

  return dia === diaHoje && mes === mesHoje;
};
