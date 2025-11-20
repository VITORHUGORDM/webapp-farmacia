"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Button from "./button";
import api from "../services/api";

interface ModalCadastroFarmaceuticoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCadastroFarmaceutico({
  isOpen,
  onClose,
}: ModalCadastroFarmaceuticoProps) {
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    CPF: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "erro" | "sucesso";
    texto: string;
  } | null>(null);

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
      const dadosFarmaceutico = {
        Nome: form.nome,
        Sobrenome: form.sobrenome,
        CPF: form.CPF,
        Telefone: form.telefone,
      };

      // Ajuste o endpoint conforme necessário.
      // Baseado no cadastroFarmaceutico/page.tsx original estava /medicamento,
      // mas aqui estou mudando para /farmaceutico pois faz mais sentido.
      await api.post("/farmaceutico", dadosFarmaceutico);

      setForm({
        nome: "",
        sobrenome: "",
        CPF: "",
        telefone: "",
      });

      setMensagem({
        tipo: "sucesso",
        texto: "Farmacêutico cadastrado com sucesso!",
      });

      // Opcional: fechar o modal após sucesso
      // setTimeout(onClose, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setMensagem({
        tipo: "erro",
        texto:
          axiosError.response?.data?.message ||
          "Erro ao cadastrar farmacêutico. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative ml-64 mb-20">
        <div className="bg-blue-900 h-10 w-full flex items-center justify-end px-4">
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
            CADASTRO FARMACÊUTICO
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Nome
              </label>
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
              <label className="block text-sm font-medium mb-1 text-black">
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
              <label className="block text-sm font-medium mb-1 text-black">
                CPF
              </label>
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
              <label className="block text-sm font-medium mb-1 text-black">
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
  );
}
