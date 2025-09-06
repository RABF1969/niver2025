export const calcularIdade = (data_nascimento: string): number => {
  const hoje = new Date();
  const [ano, mes, dia] = data_nascimento.split("-").map(Number);

  let idade = hoje.getFullYear() - ano;
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
    idade--;
  }

  return idade;
};

export const formatarData = (data: string): string => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
};

export const ehAniversarioHoje = (data_nascimento: string): boolean => {
  const hoje = new Date();
  const [, mes, dia] = data_nascimento.split("-").map(Number); // removi ano

  return hoje.getDate() === dia && hoje.getMonth() + 1 === mes;
};
