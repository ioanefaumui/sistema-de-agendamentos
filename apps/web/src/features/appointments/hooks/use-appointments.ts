"use client";

import { useState } from "react";
import { useAuth } from "@/context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { delay } from "@/utils";

export function useAppointments() {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const createAppointment = async (
    serviceId: string,
    appointmentTime: string
  ) => {
    if (!serviceId || !appointmentTime) return;

    setLoading(true);
    setError(null);

    try {
      await delay(1000);
      const response = await fetch("http://localhost:3001/appointments", {
        method: "POST",
        body: JSON.stringify({ serviceId, appointmentTime }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Falha na criação do agendamento");
      }

      toast.success("Agendamento criado com sucesso");
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error("Houve um erro no servidor. Tente novamente mais tarde");
        setError(e);
      } else {
        setError(new Error("Ocorreu um erro inesperado"));
      }
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading, error };
}
