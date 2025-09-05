import React from "react";

interface Props {
  nome: string;
  size?: "sm" | "md" | "lg";
}

const cores = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const tamanhos = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-xl",
};

const AvatarFallback: React.FC<Props> = ({ nome, size = "md" }) => {
  const iniciais = nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // cor gerada com base no tamanho do nome → sempre consistente
  const cor = cores[nome.length % cores.length];

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold shadow-md ${cor} ${tamanhos[size]}`}
    >
      {iniciais}
    </div>
  );
};

export default AvatarFallback;
