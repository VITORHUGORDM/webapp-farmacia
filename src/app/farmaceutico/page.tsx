"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";

import NavBar from "../components/navBar";
import TopBar from "../components/topBar";
import api from "../services/api";
import { Consulta, Paciente } from "../interfaces/types";

export default function PaginaTratamento() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [consultasRes, pacientesRes] = await Promise.all([
        api.get<Consulta[]>("/consulta"),
        api.get<Paciente[]>("/paciente"),
      ]);
      setConsultas(consultasRes.data);
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
        await api.delete(`/consulta/${id}`);
        setConsultas(consultas.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Erro ao excluir consulta:", error);
        alert("Erro ao excluir consulta.");
      }
    }
  }

  return (
    <div className="bg-white h-screen flex flex-row overflow-hidden ml-[288px]">
      <NavBar />
      <div className="flex flex-col flex-1">
        <TopBar title="Farmacêutico" />
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
                {consultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="bg-[#D9D9D9] rounded-full py-4 px-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <UserIconSolid className="h-12 w-12 text-black" />
                      <span className="text-black uppercase italic text-lg">
                        NOME: {getNomePaciente(consulta.paciente_id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          router.push(`/tratamento/cadastro?id=${consulta.id}`)
                        }
                        className="text-black hover:text-gray-800"
                      >
                        <PencilSquareIcon className="h-10 w-10 stroke-2" />
                      </button>
                      <button
                        onClick={() => consulta.id && handleDelete(consulta.id)}
                        className="text-black hover:text-gray-800"
                      >
                        <TrashIcon className="h-10 w-10 stroke-2" />
                      </button>
                    </div>
                  </div>
                ))}

                {consultas.length === 0 && !loading && (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhum farmacêutico encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
