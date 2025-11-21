"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "../components/button";
import api from "../services/api";
import PopupCadastroMedicamentoSucesso from "../components/PopupCadastroMedicamentoSucesso";

interface ModalCadastroMedicamentoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCadastroMedicamento({
  isOpen,
  onClose,
}: ModalCadastroMedicamentoProps) {
  const [form, setForm] = useState({
    nome: "",
    dosagem: "",
    tipo: "",
    tarja: "",
    via_consumo: "",
    mg_ml: "",
    alertas: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState({
    nome: "",
    dosagem: "",
    tipo: "",
    tarja: "",
    mg_ml: "",
    alertas: "",
  });

  if (!isOpen) return null;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    try {
      const dadosMedicamento = {
        nome: form.nome,
        dosagem: form.dosagem,
        tipo: form.tipo,
        tarja: form.tarja,
        via_consumo: form.via_consumo,
        mg_ml: form.mg_ml,
        alertas: form.alertas,
      };

      await api.post("/medicamento", dadosMedicamento);

      setSuccessData({
        nome: form.nome,
        dosagem: form.dosagem,
        tipo: form.tipo,
        tarja: form.tarja,
        mg_ml: form.mg_ml,
        alertas: form.alertas,
      });
      setShowSuccessPopup(true);

      setForm({
        nome: "",
        dosagem: "",
        tipo: "",
        tarja: "",
        via_consumo: "",
        mg_ml: "",
        alertas: "",
      });

      // setMensagem({
      //   tipo: "sucesso",
      //   texto: "Medicamento cadastrado com sucesso!",
      // });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message ||
          "Erro ao cadastrar medicamento. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PopupCadastroMedicamentoSucesso
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          onClose();
        }}
        dados={successData}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative ml-64 mb-20">
          <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
              CADASTRO MEDICAMENTOS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Nome Medicamento
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  placeholder="Ex.: Paracetamol"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Dosagem
                </label>
                <input
                  type="text"
                  name="dosagem"
                  value={form.dosagem}
                  placeholder="Ex.: 500 mg"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Tipo
                </label>
                <input
                  type="text"
                  name="tipo"
                  value={form.tipo}
                  placeholder="Ex.: Analgésico"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Tarja
                </label>
                <input
                  type="text"
                  name="tarja"
                  value={form.tarja}
                  placeholder="Ex.: Tarja vermelha"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Via de consumo
                </label>
                <input
                  type="text"
                  name="via_consumo"
                  value={form.via_consumo}
                  placeholder="Ex.: Oral"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Mg/ml
                </label>
                <input
                  type="text"
                  name="mg_ml"
                  value={form.mg_ml}
                  placeholder="Ex.: 5 mg/ml"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Alertas
                </label>
                <textarea
                  name="alertas"
                  value={form.alertas}
                  placeholder="Ex.: Não administrar com bebidas alcoólicas"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black resize-none text-sm"
                  rows={2}
                ></textarea>
              </div>
              {mensagem && (
                <div
                  className={`text-center font-semibold rounded-[10px] p-2 text-sm ${
                    mensagem.tipo === "sucesso"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {mensagem.texto}
                </div>
              )}
              <div className="pt-2 flex justify-center">
                <Button
                  text={loading ? "Cadastrando..." : "Cadastrar"}
                  onClick={() => {}}
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
