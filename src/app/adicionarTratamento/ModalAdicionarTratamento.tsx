"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "../services/api";
import { useNotification } from "../components/Notification";

interface ModalAdicionarTratamentoProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function ModalAdicionarTratamento({
  isOpen,
  onClose,
}: ModalAdicionarTratamentoProps) {
  const { showNotification } = useNotification();

  const tratamentos = [
    {
      icon: "💉",
      nome: "insulina",
      subtipo: "vermelho",
      administracao: "intramuscular",
      dose: "10 ml - Un",
      frequencia: "24hrs - 24hrs (1x ao dia)",
    },
    {
      icon: "💊",
      nome: "nome do remédio",
      subtipo: "faixa do remédio",
      administracao: "tipo de remédio",
      dose: "dosagem",
      frequencia: "via de consumo",
      frequenciaSub: "qnt comprimidos",
    },
    {
      icon: "💊",
      nome: "dipirona monoidratada",
      subtipo: "preta",
      administracao: "gotas",
      dose: "oral",
      frequencia: "5hr - 5hrs",
      frequenciaSub: "5 gotas / 20kg",
    },
    {
      icon: "💉",
      nome: "insulina",
      subtipo: "vermelho",
      administracao: "intramuscular",
      dose: "10 ml - Un",
      frequencia: "24hrs - 24hrs (1x ao dia)",
    },
    {
      icon: "💊",
      nome: "nome do remédio",
      subtipo: "faixa do remédio",
      administracao: "tipo de remédio",
      dose: "dosagem",
      frequencia: "via de consumo",
      frequenciaSub: "qnt comprimidos",
    },
    {
      icon: "💊",
      nome: "dipirona monoidratada",
      subtipo: "preta",
      administracao: "gotas",
      dose: "oral",
      frequencia: "5hr - 5hrs",
      frequenciaSub: "5 gotas / 20kg",
    },
  ];

  async function handleAdd(tratamento: any) {
    try {
      const payload = {
        nome: tratamento.nome,
        dosagem: tratamento.dose,
        tipo: "Medicamento",
        tarja: tratamento.subtipo,
        via_consumo: tratamento.administracao,
        mg_ml: "N/A",
        alertas: tratamento.frequencia,
      };

      await api.post("/medicamento", payload);
      showNotification("success", "Adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar tratamento:", error);
      showNotification("error", "Erro ao adicionar tratamento.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative ml-64 mb-20">
        <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-blue-900 uppercase tracking-wide"></h2>
          </div>

          <div className="space-y-3">
            {tratamentos.map((tratamento, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">{tratamento.icon}</span>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {tratamento.nome}
                    </p>
                    <p className="text-xs text-gray-600 italic">
                      {tratamento.subtipo}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 font-medium">
                      {tratamento.administracao}
                    </p>
                    <p className="text-xs text-gray-900">{tratamento.dose}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-900">
                      {tratamento.frequencia}
                    </p>
                    {tratamento.frequenciaSub && (
                      <p className="text-xs text-gray-600 italic">
                        {tratamento.frequenciaSub}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(tratamento)}
                  className="flex-shrink-0 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="text-xl font-bold">+</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
