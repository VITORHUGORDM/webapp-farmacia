"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";

import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import Button from "../components/button";
import api from "../services/api";

export default function CadastroMedicamentos() {
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

      setForm({
        nome: "",
        dosagem: "",
        tipo: "",
        tarja: "",
        via_consumo: "",
        mg_ml: "",
        alertas: "",
      });

      setMensagem({
        tipo: "sucesso",
        texto: "Medicamento cadastrado com sucesso!",
      });
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

  // ...existing code...
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 min-w-[1280px] overflow-hidden">
      <NavBar />
      <div className="ml-72">
        <TopBar title="CADASTRO MEDICAMENTOS" />
        <main className="flex justify-center items-center h-[calc(100vh-64px)] mt-16 px-0">
          <div className="w-[600px]">
            <div className="overflow-hidden rounded-[20px] shadow-lg border border-blue-200 bg-white">
              <div className="bg-blue-900 h-10 w-full"></div>
              {/* Formulário de cadastro de medicamento */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">Tipo</label>
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
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">
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
        </main>
      </div>
    </div>
  );
}
