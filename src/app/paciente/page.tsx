"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";

import NavBar from "@/app/components/navBar";
import TopBar from "../components/topBar";
import api from "../services/api";
import { Tratamento, Paciente } from "../interfaces/types";
import CadastroPaciente from "../cadastroPaciente/page";

export default function PaginaTratamento() {
  const router = useRouter();
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // modal de editar paciente
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);
  const [editForm, setEditForm] = useState({
    nome_completo: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [tratamentosRes, pacientesRes] = await Promise.all([
        api.get<Tratamento[]>("/tratamento"),
        api.get<Paciente[]>("/paciente"),
      ]);
      setTratamentos(tratamentosRes.data);
      setPacientes(pacientesRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function getNomePaciente(id: number | string) {
    return (
      pacientes.find((p) => p.id === Number(id))?.nome_completo ||
      "Desconhecido"
    );
  }

  async function handleDelete(id: number | string) {
    if (confirm("Tem certeza que deseja excluir esta consulta?")) {
      try {
        await api.delete(`/tratamento/${id}`);
        setTratamentos(tratamentos.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Erro ao excluir consulta:", error);
        alert("Erro ao excluir consulta.");
      }
    }
  }

  function openEditModal(pacienteId: number | string) {
    const paciente = pacientes.find((p) => p.id === Number(pacienteId));
    if (paciente) {
      setEditingPatient(paciente);
      setEditForm({
        nome_completo: paciente.nome_completo || "",
        cpf: paciente.cpf || "",
        telefone: paciente.telefone || "",
        email: paciente.email || "",
      });
      setIsEditModalOpen(true);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPatient) return;

    try {
      await api.put(`/paciente/${editingPatient.id}`, editForm);
      setPacientes(
        pacientes.map((p) =>
          p.id === editingPatient.id ? { ...p, ...editForm } : p
        )
      );
      setIsEditModalOpen(false);
      alert("Paciente atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      alert("Erro ao atualizar paciente.");
    }
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Paciente" />
        <main className="flex flex-1 items-start justify-center p-8 overflow-y-auto bg-gray-100 relative mt-4">
          <div className="bg-white w-full max-w-5xl mt-8 rounded-[20px] shadow-sm overflow-hidden">
            <div className="bg-blue-900 h-12 w-full"></div>
            <div className="p-6">
              <div className="flex justify-end mb-1">
                <span className="text-sm italic text-black mr-10">
                  editar e excluir
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {tratamentos.map((tratamento) => (
                  <div
                    key={tratamento.id}
                    className="bg-[#D9D9D9] rounded-full py-4 px-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <UserIconSolid className="h-12 w-12 text-black" />
                      <span className="text-black uppercase italic text-lg">
                        NOME: {getNomePaciente(tratamento.paciente_id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(tratamento.paciente_id)}
                        className="text-black hover:text-gray-800"
                      >
                        <PencilSquareIcon className="h-10 w-10 stroke-2" />
                      </button>
                      <button
                        onClick={() =>
                          tratamento.id && handleDelete(tratamento.id)
                        }
                        className="text-black hover:text-gray-800"
                      >
                        <TrashIcon className="h-10 w-10 stroke-2" />
                      </button>
                    </div>
                  </div>
                ))}

                {tratamentos.length === 0 && !loading && (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhum paciente encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-10 right-10 px-25 py-8 bg-blue-900 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors pointer-events-auto"
          >
            <h1>Cadastrar Paciente</h1>
          </button>
          <CadastroPaciente
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
              <div className="bg-white rounded-[20px] shadow-lg w-[500px] overflow-hidden">
                <div className="bg-blue-900 h-12 w-full flex items-center justify-end px-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                    EDITAR PACIENTE
                  </h2>
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Nome Completo"
                        value={editForm.nome_completo}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            nome_completo: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CPF"
                        value={editForm.cpf}
                        onChange={(e) =>
                          setEditForm({ ...editForm, cpf: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Telefone"
                        value={editForm.telefone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, telefone: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        type="submit"
                        className="bg-blue-900 text-white font-bold py-3 px-12 rounded-full hover:bg-blue-800 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
