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
    sobrenome: "",
    CPF: "",
    telefone: "",
    genero: "",
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
        Nome: form.nome,
        Sobrenome: form.sobrenome,
        CPF: form.CPF,
        Telefone: form.telefone,
      };

      await api.post("/medicamento", dadosMedicamento);

      setForm({
        nome: "",
        sobrenome: "",
        CPF: "",
        telefone: "",
        genero: "",
      });

      setMensagem({
        tipo: "sucesso",
        texto: "Farmaceutico cadastrado com sucesso!",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message ||
          "Erro ao cadastrar farmaceutico. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 min-w-[1280px] overflow-hidden">
      <NavBar />
      <div className="ml-72">
        <TopBar title="CADASTRO FARMACEUTICO" />
        <main className="flex justify-center items-center h-[calc(100vh-64px)] mt-16 px-0">
          <div className="w-[600px]">
            <div className="overflow-hidden rounded-[20px] shadow-lg border border-blue-200 bg-white">
              <div className="bg-blue-900 h-10 w-full"></div>
              {/* Formulário de cadastro de Farmaceuticos */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    placeholder="Ex.: Vitor"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    name="sobrenome"
                    value={form.sobrenome}
                    placeholder="Ex.: Silva"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CPF</label>
                  <input
                    type="text"
                    name="CPF"
                    value={form.CPF}
                    placeholder="Ex.: 123.456.789-00"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={form.telefone}
                    placeholder="Ex.: (11) 91234-5678"
                    onChange={handleChange}
                    className="border border-gray-300 rounded-[10px] px-3 py-2 w-full text-black text-sm"
                    required
                  />
                </div>
                <div></div>
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
