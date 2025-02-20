import { useState } from "react";
import { useAuth } from "@/context";
import { toast } from "sonner";
import { CreateServiceDto } from "../dto";
import { delay } from "@/utils";
import { useRouter } from "next/navigation";
import { clientSideApi } from "@/lib";

export function useServices() {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const createService = async (values: CreateServiceDto) => {
    setLoading(true);
    setError(null);

    try {
      delay(1000);
      const response = await fetch(`${clientSideApi}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Falha ao criar o serviço");
      }

      toast.success("Serviço criado com sucesso");

      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error("Houve um erro no servidor. Tente novamente mais tarde");
        setError(e);
      } else {
        setError(new Error("Ocorreu um erro insesperado"));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      delay(1000);
      const response = await fetch(`${clientSideApi}/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Falha ao remover o serviço");
      }

      toast.success("Serviço removido com sucesso");
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

  return { createService, loading, error, deleteService };
}
