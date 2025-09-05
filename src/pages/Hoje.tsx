import React, { useState } from "react";
import { Aniversariante } from "../types";
import AniversariantesDoDia from "../components/AniversariantesDoDia";
import { mockAniversariantes } from "../data/mockData";

const Hoje: React.FC = () => {
  const [aniversariantes] = useState<Aniversariante[]>(mockAniversariantes);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AniversariantesDoDia aniversariantes={aniversariantes} />
    </div>
  );
};

export default Hoje;
